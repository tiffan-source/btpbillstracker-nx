import { computed, inject, Injectable, signal } from "@angular/core";
import { CreateQuickClientUseCase } from "@btpbilltracker/clients";
import { ToastService } from "libs/components/src/lib/toast/toast";
import { BillStore } from "src/app/stores/bills.store";
import { ClientStore } from "src/app/stores/client.store";

export type CreateClientRequest = {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    email?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientsOrchestrator {
    private readonly clientsStore = inject(ClientStore);
    private readonly billsStore = inject(BillStore);
    private toastService = inject(ToastService);
    private readonly createClientUseCase = inject(CreateQuickClientUseCase);

    operationInformation = signal<{
        isLoading: boolean;
    }>({
        isLoading: false
    });

    clientOptions = computed(() => {
        const clients = this.clientsStore.clients();        
        
        return clients.map(client => {           
            return {
                label: `${client.firstName} ${client.lastName ?? ""}`.trim(),
                value: client.id
            }
        });
    });

    clientsInformation = computed(() => {
        return this.clientsStore.clients().map(client => {
            let factureNumber: number = 0;
            let factureNumberUnpaid: number = 0;
            let amountPaid: number = 0;
            let amountUnpaid: number = 0;

            this.billsStore.bills().filter(bill => bill.clientId === client.id).forEach(bill => {
                factureNumber += 1;
                if (bill.status === 'paid') {
                    amountPaid = (amountPaid || 0) + bill.amount;
                } else {
                    factureNumberUnpaid = (factureNumberUnpaid || 0) + 1;
                    amountUnpaid = (amountUnpaid || 0) + bill.amount;
                }
            });

            return {
                id: client.id,
                name: client.firstName + ' ' + client.lastName,
                factureNumber: factureNumber,
                factureNumberUnpaid: factureNumberUnpaid,
                amountPaid: amountPaid,
                amountUnpaid: amountUnpaid
            }
        })
    });

    async createClient(request: CreateClientRequest): Promise<string | null> {
        this.operationInformation.set({
            isLoading: true
        });

        let result = await this.createClientUseCase.execute({
            firstName: request.firstName,
            lastName: request.lastName,
            email: request.email,
            phone: request.phoneNumber
        })

        if (result.success) {
            // Optimistically update the client list with the newly created client, since we don't want to wait for a new fetch to display it in the client selection dropdown. The id is generated on the frontend, so we can already add it to the list with the correct information.
            this.clientsStore.addClient({
                id: result.data.id,
                firstName: result.data.firstName,
                lastName: result.data.lastName,
                email: result.data.email,
                phone: result.data.phone
            });

            this.operationInformation.set({
                isLoading: false
            });
            return result.data.id;
        } else {
            this.operationInformation.set({
                isLoading: false
            });

            this.toastService.showToast('error', "Une erreur est survenue lors de la création du client");
            return null;
        }
    }
}