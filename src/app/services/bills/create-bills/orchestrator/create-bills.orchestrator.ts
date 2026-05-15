import { inject, Injectable, signal } from "@angular/core";
import { CreateEnrichedBillInput, CreateEnrichedBillUseCase, UploadBillPdfUseCase } from "@btpbilltracker/bills"
import { ToastService } from "libs/components/src/lib/toast/toast";
import { BillStore } from "src/app/stores/bills.store";

export interface CreateBillRequest {
  type: string;
  client: string;
  chantier: string;
  amount: number;
  dueDate: Date;
  paymentMode: string;
  invoiceNumber: string;
  reminderScenarioId: string | null;
  billPdfFile: File | null;
}

@Injectable({ providedIn: 'root' })
export class CreateBillsOrchestrator {
    private createBillsUsecase = inject(CreateEnrichedBillUseCase)
    private uploadBillPdfUseCase = inject(UploadBillPdfUseCase)
    private readonly toastService = inject(ToastService);
    private billStore = inject(BillStore);

    isProcessing = signal(false);
    
    createBillProcess = async (bill: CreateBillRequest): Promise<void> => {
        this.isProcessing.set(true);

        try {
            const resolvedPdf = await this.resolvePdfId(bill.billPdfFile);
            if (!resolvedPdf.success) {
                this.toastService.showToast('error', "Une erreur est survenue lors de l'upload du PDF de la facture");
                return;
            }

            const enrichedBill: CreateEnrichedBillInput = {
                type: bill.type,
                clientId: bill.client,
                chantierId: bill.chantier,
                amountTTC: bill.amount,
                dueDate: bill.dueDate,
                paymentMode: bill.paymentMode,
                externalInvoiceReference: bill.invoiceNumber,
                reminderScenarioId: bill.reminderScenarioId || undefined,
                billDocumentId: resolvedPdf.data.billPdfId || undefined
            };

            const result = await this.createBillsUsecase.execute(enrichedBill);
            if (!result.success) {
                this.toastService.showToast('error', "Une erreur est survenue lors de la création de la facture");
                return;
            } else {
                const persistedBillPdfId = result.data.billDocumentId ?? null;
                this.billStore.addBill({
                    id: result.data.id,
                    clientId: enrichedBill.clientId,
                    chantierId: enrichedBill.chantierId,
                    amount: enrichedBill.amountTTC,
                    dueDate: enrichedBill.dueDate.toDateString(),
                    status: 'unpaid',
                    invoiceNumber: enrichedBill.externalInvoiceReference,
                    type: enrichedBill.type,
                    paymentMode: enrichedBill.paymentMode,
                    reminderScenarioId: enrichedBill.reminderScenarioId || null,
                    billPdfId: persistedBillPdfId
                });
                this.toastService.showToast('success', "La facture a été créée avec succès");
                return ;
            }
        } catch (error: unknown) {
            this.toastService.showToast('error', "Une erreur est survenue lors de la création de la facture");
            return ;
        } finally {
            this.isProcessing.set(false);
        }
    }

    private async resolvePdfId(pdfFile: File | null): Promise<{ success: boolean; data: { billPdfId: string | null } }> {
        if (!pdfFile) {
            return { success: true, data: { billPdfId: null } };
        }
        const uploadResult = await this.uploadBillPdfUseCase.execute(pdfFile);
        if (!uploadResult.success) {
            return {
                success: false,
                data: { billPdfId: null }
            };
        }

        return { success: true, data: { billPdfId: uploadResult.data } };
    }

}
