import { computed, inject, Injectable, signal } from "@angular/core";
import { CreateEnrichedBillInput, CreateEnrichedBillUseCase } from "@btpbilltracker/bills"
import { CreateQuickClientUseCase } from "@btpbilltracker/clients"
import { CreateChantierUseCase } from "@btpbilltracker/chantiers";
import { ClientStore } from "../../../stores/client.store"
import { ChantierStore } from "src/app/stores/chantier.store";

export type CreateBillClientRequest =
  | { mode: "existing"; clientId: string }
  | { mode: "new"; clientName: string };

export type CreateBillChantierRequest =
  | { mode: "existing"; chantierId: string }
  | { mode: "new"; chantierName: string };

export interface CreateBillRequest {
  type: string;
  client: CreateBillClientRequest;
  chantier: CreateBillChantierRequest;
  amount: number;
  dueDate: string;
  paymentMode: string;
  invoiceNumber: string;
  reminderScenarioId: string | null;
}

type CreateBillWorkflowStep = "client" | "chantier" | "bill";

export type CreateBillProcessResult =
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
      step: CreateBillWorkflowStep;
      error: {
        code: string;
        message: string;
      };
    };

@Injectable({ providedIn: 'root' })
export class CreateBillsOrchestrator {
    private createBillsUsecase = inject(CreateEnrichedBillUseCase)
    private createClientUsecase = inject(CreateQuickClientUseCase)
    private createChantierUsecase = inject(CreateChantierUseCase)

    private clientStore = inject(ClientStore);
    private chantierStore = inject(ChantierStore);

    processError = signal<string | null>(null);
    isProcessing = signal(false);
    
    clientOptions = computed(() => {
        const clients = this.clientStore.clients();        
        
        return clients.map(client => {           
            return {
                label: `${client.firstName} ${client.lastName ?? ""}`.trim(),
                value: client.id
            }
        });
    });

    chantierOptions = computed(() => {
        const chantiers = this.chantierStore.chantiers();
        
        return chantiers.map(chantier => ({
            label: chantier.name,
            value: chantier.id
        }));
    });

    createBillProcess = async (bill: CreateBillRequest): Promise<CreateBillProcessResult> => {
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

            const enrichedBill: CreateEnrichedBillInput = {
                type: bill.type,
                clientId: resolvedClient.data.clientId,
                chantierId: resolvedChantier.data.chantierId,
                amountTTC: bill.amount,
                dueDate: bill.dueDate,
                paymentMode: bill.paymentMode,
                externalInvoiceReference: bill.invoiceNumber,
                reminderScenarioId: bill.reminderScenarioId || undefined
            };

            const result = await this.createBillsUsecase.execute(enrichedBill);
            if (!result.success) {
                const failureResult: CreateBillProcessResult = {
                    success: false,
                    step: "bill",
                    error: {
                        code: result.error.code,
                        message: result.error.message
                    }
                };
                this.processError.set(failureResult.error.message);
                return failureResult;
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

    private async resolveClientId(client: CreateBillClientRequest): Promise<CreateBillProcessResult | { success: true; data: { clientId: string } }> {
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

    private async resolveChantierId(chantier: CreateBillChantierRequest): Promise<CreateBillProcessResult | { success: true; data: { chantierId: string } }> {
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
