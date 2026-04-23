import { computed, inject, Injectable, signal } from "@angular/core";
import { BILL_STATUS, DeleteBillPdfUseCase, EditBillInput, EditBillUseCase, UploadBillPdfUseCase } from "@btpbilltracker/bills";
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

export type UploadedBillPdfRequest = File | null;

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
  billPdfFile: UploadedBillPdfRequest;
}


type EditBillWorkflowStep = "client" | "chantier" | "pdf" | "bill";
const UNEXPECTED_WORKFLOW_ERROR_CODE = "UNEXPECTED_WORKFLOW_ERROR";

export type EditBillProcessResult =
  | {
      success: true;
      data: {
        billId: string;
        clientId: string;
        chantierId: string;
        billPdfId?: string | null;
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
    private readonly uploadBillPdfUseCase = inject(UploadBillPdfUseCase);
    private readonly deleteBillPdfUseCase = inject(DeleteBillPdfUseCase);

    private readonly clientStore = inject(ClientStore);
    private readonly chantierStore = inject(ChantierStore);
    private readonly billStore = inject(BillStore);

    private lastProcessResult = signal<EditBillProcessResult | null>(null);
    processError = computed(() => {
        const result = this.lastProcessResult();
        return result && !result.success ? result.error.message : null;
    });
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
        this.lastProcessResult.set(null);
        this.isProcessing.set(true);
        let currentStep: EditBillWorkflowStep = "client";

        try {
            const resolvedClient = await this.resolveClientId(bill.client);
            if (!resolvedClient.success) {
                this.lastProcessResult.set(resolvedClient);
                return resolvedClient;
            }

            currentStep = "chantier";
            const resolvedChantier = await this.resolveChantierId(bill.chantier);
            if (!resolvedChantier.success) {
                this.lastProcessResult.set(resolvedChantier);
                return resolvedChantier;
            }

            currentStep = "pdf";
            const resolveBillPdf = await this.resolvePdfId(bill.billPdfFile, bill.billId);
            if (!resolveBillPdf.success) {
                this.lastProcessResult.set(resolveBillPdf);
                return resolveBillPdf;
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
                reminderScenarioId: bill.reminderScenarioId || undefined,
                billDocumentId: resolveBillPdf.data.billPdfId ?? undefined
            };

            currentStep = "bill";
            const result = await this.editBillUsecase.execute(enrichedBill);
            if (!result.success) {
                const failureResult = this.failure("bill", result.error.code, `Failed to update bill: ${result.error.message}`);
                this.lastProcessResult.set(failureResult);
                return failureResult;
            }

            const persistedBillPdfId = result.data.billDocumentId ?? null;
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
                reminderScenarioId: bill.reminderScenarioId || null,
                billPdfId: persistedBillPdfId
            });

            const successResult: EditBillProcessResult = {
                success: true,
                data: {
                    billId: result.data.id,
                    clientId: resolvedClient.data.clientId,
                    chantierId: resolvedChantier.data.chantierId,
                    billPdfId: persistedBillPdfId
                }
            };
            this.lastProcessResult.set(successResult);
            return successResult;
        } catch (error: unknown) {
            const failureResult = this.failure(
                currentStep,
                UNEXPECTED_WORKFLOW_ERROR_CODE,
                `${this.stepMessage(currentStep)}: ${this.errorMessage(error)}`
            );
            this.lastProcessResult.set(failureResult);
            return failureResult;
        } finally {
            this.isProcessing.set(false);
        }
    }

    private async resolvePdfId(pdfFile: UploadedBillPdfRequest, billId: string): Promise<EditBillProcessResult | { success: true; data: { billPdfId: string | null } }> {
        const previousBillPdfId = this.billStore.bills().find((bill) => bill.id === billId)?.billPdfId ?? null;

        if (!pdfFile) {
            return { success: true, data: { billPdfId: previousBillPdfId } };
        }

        const uploadResult = await this.uploadBillPdfUseCase.execute(pdfFile);
        if (!uploadResult.success) {
            return {
                success: false,
                step: "pdf",
                error: {
                    code: uploadResult.error.code,
                    message: `Failed to upload PDF: ${uploadResult.error.message}. Previous PDF is still linked. Please retry the upload.`
                }
            };
        }

        if (previousBillPdfId && previousBillPdfId !== uploadResult.data) {
            const deleteResult = await this.deleteBillPdfUseCase.execute(previousBillPdfId);
            if (!deleteResult.success) {
                return {
                    success: false,
                    step: "pdf",
                    error: {
                        code: deleteResult.error.code,
                        message: `Uploaded the new PDF but failed to remove the previous one: ${deleteResult.error.message}. Please retry replacement.`
                    }
                };
            }
        }

        return { success: true, data: { billPdfId: uploadResult.data } };
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

    private failure(step: EditBillWorkflowStep, code: string, message: string): EditBillProcessResult {
        return {
            success: false,
            step,
            error: {
                code,
                message
            }
        };
    }

    private stepMessage(step: EditBillWorkflowStep): string {
        switch (step) {
            case "client":
                return "Failed to create client";
            case "chantier":
                return "Failed to create chantier";
            case "pdf":
                return "Failed to process bill PDF";
            case "bill":
                return "Failed to update bill";
        }
    }

    private errorMessage(error: unknown): string {
        return error instanceof Error ? error.message : "An unexpected error occurred";
    }
}
