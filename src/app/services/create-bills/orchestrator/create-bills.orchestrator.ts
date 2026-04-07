import { inject, Injectable, signal } from "@angular/core";
import { CreateEnrichedBillInput, CreateEnrichedBillUseCase } from "@btpbilltracker/bills"
import { CreateQuickClientUseCase } from "@btpbilltracker/clients"
import { CreateChantierUseCase } from "libs/chantiers/src/lib/usecases/create-chantier.usecase";

export interface CreateBillRequest {
    type: string;
    client: {
        name: string | null;
        id: string | null;
    }
    chantier: {
        name: string | null;
        id: string | null;
    },
    amount: number;
    dueDate: Date;
    paymentMode: string;
    invoiceNumber: string;
    reminderScenarioId: string | null;
}

@Injectable({ providedIn: 'root' })
export class CreateBillsOrchestrator {
    private createBillsUsecase = inject(CreateEnrichedBillUseCase)
    private createClientUsecase = inject(CreateQuickClientUseCase)
    private createChantierUsecase = inject(CreateChantierUseCase)

    processError = signal<string | null>(null);
    isProcessing = signal(false);

    createBillProcess = async (bill: CreateBillRequest) => {
        this.processError.set(null);
        this.isProcessing.set(true);

        let clientId: string | undefined, chantierId: string | undefined;

        if (bill.client.id) {
            clientId = bill.client.id;
        } else if (bill.client.name) {
            const client = await this.createClientUsecase.execute({firstName: bill.client.name, lastName: "CLIENT"});
            if (!client.success) {
                this.processError.set("Failed to create client");
                this.isProcessing.set(false);
                return false;
            }
            clientId = client.data.id;
        }

        if (bill.chantier.id) {
            chantierId = bill.chantier.id;
        } else if (bill.chantier.name) {
            const chantier = await this.createChantierUsecase.execute({name: bill.chantier.name});
            if (!chantier.success) {
                this.processError.set("Failed to create chantier");
                this.isProcessing.set(false);
                return false;
            }
            chantierId = chantier.data.id;
        }

        const enrichedBill: CreateEnrichedBillInput = {
            type: bill.type,
            clientId: clientId!,
            chantierId: chantierId!,
            amountTTC: bill.amount,
            dueDate: bill.dueDate.toDateString(),
            paymentMode: bill.paymentMode,
            externalInvoiceReference: bill.invoiceNumber,
            reminderScenarioId: bill.reminderScenarioId || undefined
        };

        let result = await this.createBillsUsecase.execute(enrichedBill);
        this.isProcessing.set(false);

        if (!result.success) {
            this.processError.set(result.error.message);
            return false;
        } else {
            return result.success;
        }
    }
}