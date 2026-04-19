import { inject, Injectable, signal } from "@angular/core";
import { BILL_STATUS, EditBillInput, EditBillUseCase } from "@btpbilltracker/bills";
import { ClientStore } from "src/app/stores/client.store";
import { ChantierStore } from "src/app/stores/chantier.store";
import { BillStore } from "src/app/stores/bills.store";
import { CreateQuickClientUseCase } from "@btpbilltracker/clients";
import { CreateChantierUseCase } from "@btpbilltracker/chantiers";

export type CreateBillClientRequest =
  | { mode: "existing"; clientId: string }
  | { mode: "new"; clientName: string };

export type CreateBillChantierRequest =
  | { mode: "existing"; chantierId: string }
  | { mode: "new"; chantierName: string };

export interface EditBillRequest {
    billId: string;
  type: string;
  client: CreateBillClientRequest;
  chantier: CreateBillChantierRequest;
  amount: number;
  dueDate: string;
  paymentMode: string;
  invoiceNumber: string;
  reminderScenarioId: string | null;
}


type EditBillWorkflowStep = "client" | "chantier" | "bill";

export type EditBillProcessResult =
  | {
      success: true;
      data: {
        billId: string;
        clientId: string;
        chantierId: string;
      };
    }
  | {
      success: false;
      step: EditBillWorkflowStep;
      error: {
        code: string;
        message: string;
      };
    };

@Injectable({
    providedIn: 'root'
})
export class EditBillsOrchestrator {
    private readonly createClientUsecase = inject(CreateQuickClientUseCase);
    private readonly createChantierUsecase = inject(CreateChantierUseCase);
    private readonly editBillUsecase = inject(EditBillUseCase);

    private readonly clientStore = inject(ClientStore);
    private readonly chantierStore = inject(ChantierStore);
    private readonly billStore = inject(BillStore);

    processError = signal<string | null>(null);
    isProcessing = signal(false);
    
    getBillInformationToEdit = (billId: string) => {
        let bill = this.billStore.bills().find(bill => bill.id === billId);

        let client = bill?.clientId || '';
        let chantier = bill?.chantierId || '';

        return {
            clientId: client,
            chantierId: chantier,
            amount: bill?.amount || 0,
            dueDate: bill ? new Date(bill.dueDate) : null,
            invoiceNumber: bill?.invoiceNumber || '',
            type: bill?.type || '',
            paymentMode: bill?.paymentMode || '',
            reminderScenarioId: bill?.reminderScenarioId || null
        }
    }

    editBillProcess = async (bill: EditBillRequest): Promise<EditBillProcessResult> => {
        this.processError.set(null);
        this.isProcessing.set(true);

        try {
            const resolvedClient = await this.resolveClientId(bill.client);
            if (!resolvedClient.success) {
                this.processError.set(resolvedClient.error.message);
                return resolvedClient;
            }

            const resolvedChantier = await this.resolveChantierId(bill.chantier);
            if (!resolvedChantier.success) {
                this.processError.set(resolvedChantier.error.message);
                return resolvedChantier;
            }

            const enrichedBill: EditBillInput = {
                billId: bill.billId,
                type: bill.type,
                clientId: resolvedClient.data.clientId,
                chantierId: resolvedChantier.data.chantierId,
                amountTTC: bill.amount,
                dueDate: bill.dueDate,
                paymentMode: bill.paymentMode,
                externalInvoiceReference: bill.invoiceNumber,
                reminderScenarioId: bill.reminderScenarioId || undefined
            };

            const result = await this.editBillUsecase.execute(enrichedBill);
            if (!result.success) {
                const failureResult: EditBillProcessResult = {
                    success: false,
                    step: "bill",
                    error: {
                        code: result.error.code,
                        message: result.error.message
                    }
                };
                this.processError.set(failureResult.error.message);
                return failureResult;
            } else {
                this.billStore.updateBill({
                    id: result.data.id,
                    clientId: resolvedClient.data.clientId,
                    chantierId: resolvedChantier.data.chantierId,
                    amount: bill.amount,
                    dueDate: bill.dueDate,
                    status: result.data.status === BILL_STATUS.PAID ? 'paid' : 'unpaid',
                    invoiceNumber: bill.invoiceNumber,
                    type: bill.type,
                    paymentMode: bill.paymentMode,
                    reminderScenarioId: bill.reminderScenarioId || null
                });
            }

            return {
                success: true,
                data: {
                    billId: result.data.id,
                    clientId: resolvedClient.data.clientId,
                    chantierId: resolvedChantier.data.chantierId
                }
            };
        } finally {
            this.isProcessing.set(false);
        }
    }


    private async resolveClientId(client: CreateBillClientRequest): Promise<EditBillProcessResult | { success: true; data: { clientId: string } }> {
        if (client.mode === "existing") {
            return { success: true, data: { clientId: client.clientId } };
        }

        const createdClient = await this.createClientUsecase.execute({ firstName: client.clientName, lastName: "CLIENT" });
        if (!createdClient.success) {
            return {
                success: false,
                step: "client",
                error: {
                    code: createdClient.error.code,
                    message: `Failed to create client: ${createdClient.error.message}`
                }
            };
        }

        this.clientStore.addClient({ id: createdClient.data.id, firstName: createdClient.data.firstName ?? '', lastName: createdClient.data.lastName ?? '' });
        return { success: true, data: { clientId: createdClient.data.id } };
    }

    private async resolveChantierId(chantier: CreateBillChantierRequest): Promise<EditBillProcessResult | { success: true; data: { chantierId: string } }> {
        if (chantier.mode === "existing") {
            return { success: true, data: { chantierId: chantier.chantierId } };
        }

        const createdChantier = await this.createChantierUsecase.execute({ name: chantier.chantierName });
        if (!createdChantier.success) {
            return {
                success: false,
                step: "chantier",
                error: {
                    code: createdChantier.error.code,
                    message: `Failed to create chantier: ${createdChantier.error.message}`
                }
            };
        }

        this.chantierStore.addChantier({ id: createdChantier.data.id, name: createdChantier.data.name });
        return { success: true, data: { chantierId: createdChantier.data.id } };
    }
}