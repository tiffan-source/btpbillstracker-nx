import { inject, Injectable, signal } from "@angular/core";
import { BILL_STATUS, DeleteBillPdfUseCase, EditBillInput, EditBillUseCase, UploadBillPdfUseCase } from "@btpbilltracker/bills";
import { ToastService } from "libs/components/src/lib/toast/toast";
import { BillStore } from "src/app/stores/bills.store";

export interface EditBillRequest {
    billId: string;
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

@Injectable({
    providedIn: 'root'
})
export class EditBillsOrchestrator {
    private readonly editBillUsecase = inject(EditBillUseCase);
    private readonly uploadBillPdfUseCase = inject(UploadBillPdfUseCase);
    private readonly deleteBillPdfUseCase = inject(DeleteBillPdfUseCase);
    private readonly toastService = inject(ToastService);
    private readonly billStore = inject(BillStore);

    isProcessing = signal(false);
    
    getBillInformationToEdit = (billId: string) => {
        let bill = this.billStore.bills().find(bill => bill.id === billId);

        if (!bill) {
            return {
                clientId: '',
                chantierId: '',
                amount: 0,
                dueDate: new Date(),
                invoiceNumber: '',
                type: '',
                paymentMode: '',
                reminderScenarioId: null,
                documentId: null
            };
        }

        let client = bill.clientId;
        let chantier = bill.chantierId;

        return {
            clientId: client,
            chantierId: chantier,
            amount: bill.amount,
            dueDate: new Date(bill.dueDate),
            invoiceNumber: bill.invoiceNumber,
            type: bill.type,
            paymentMode: bill.paymentMode,
            reminderScenarioId: bill.reminderScenarioId,
            documentId: bill.billPdfId
        }
    }

    billPdfUrl = (billId: string) => {
        let bill = this.billStore.bills().find(bill => bill.id === billId);
        return bill?.billPdfId;
    }

    editBillProcess = async (bill: EditBillRequest): Promise<void> => {
        this.isProcessing.set(true);

        try {

            const resolveBillPdf = await this.resolvePdfId(bill.billPdfFile, bill.billId);
            if (!resolveBillPdf.success) {
                this.toastService.showToast('error', "Une erreur est survenue lors de l'upload du PDF de la facture");
                return;
            }

            const enrichedBill: EditBillInput = {
                billId: bill.billId,
                type: bill.type,
                clientId: bill.client,
                chantierId: bill.chantier,
                amountTTC: bill.amount,
                dueDate: bill.dueDate,
                paymentMode: bill.paymentMode,
                externalInvoiceReference: bill.invoiceNumber,
                reminderScenarioId: bill.reminderScenarioId || undefined,
                billDocumentId: resolveBillPdf.data.billPdfId ?? undefined
            };

            const result = await this.editBillUsecase.execute(enrichedBill);
            if (!result.success) {
                this.toastService.showToast('error', "Une erreur est survenue lors de la modification de la facture");
                return ;
            }
            this.toastService.showToast('success', "La facture a été modifiée avec succès");

            const persistedBillPdfId = result.data.billDocumentId ?? null;
            this.billStore.updateBill({
                id: result.data.id,
                clientId: bill.client,
                chantierId: bill.chantier,
                amount: bill.amount,
                dueDate: bill.dueDate.toDateString(),
                status: result.data.status === BILL_STATUS.PAID ? 'paid' : 'unpaid',
                invoiceNumber: bill.invoiceNumber,
                type: bill.type,
                paymentMode: bill.paymentMode,
                reminderScenarioId: bill.reminderScenarioId || null,
                billPdfId: persistedBillPdfId
            });
        } catch (error: unknown) {
            this.toastService.showToast('error', "Une erreur est survenue lors de la modification de la facture");
            return ;
        } finally {
            this.isProcessing.set(false);
        }
    }

    private async resolvePdfId(pdfFile: File | null, billId: string): Promise<{ success: boolean; data: { billPdfId: string | null } }> {
        const previousBillPdfId = this.billStore.bills().find((bill) => bill.id === billId)?.billPdfId ?? null;

        if (!pdfFile) {
            return { success: true, data: { billPdfId: previousBillPdfId } };
        }

        const uploadResult = await this.uploadBillPdfUseCase.execute(pdfFile);
        if (!uploadResult.success) {
            return {
                success: false,
                data: { billPdfId: null },
            };
        }

        if (previousBillPdfId && previousBillPdfId !== uploadResult.data) {
            const deleteResult = await this.deleteBillPdfUseCase.execute(previousBillPdfId);
            if (!deleteResult.success) {
                return {
                    success: false,
                    data: { billPdfId: null },
                };
            }
        }

        return { success: true, data: { billPdfId: uploadResult.data } };
    }
}
