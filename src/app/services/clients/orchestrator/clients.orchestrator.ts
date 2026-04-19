import { computed, inject, Injectable } from "@angular/core";
import { BillStore } from "src/app/stores/bills.store";
import { ClientStore } from "src/app/stores/client.store";

@Injectable({ providedIn: 'root' })
export class ClientsOrchestrator {
    private readonly clientsStore = inject(ClientStore);
    private readonly billsStore = inject(BillStore);

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

}