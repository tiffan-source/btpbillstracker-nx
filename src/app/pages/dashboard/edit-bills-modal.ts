import { Component, computed, effect, inject, input, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Modal, Button, Tabs } from "@btpbilltracker/components";
import { BillFormField, PaymentMode, TypeBill } from "src/app/forms/bill.form.type";
import { EditBillForm } from "src/app/forms/edit-bill.form";
import { EditBillsOrchestrator } from "src/app/services/bills/edit-bills/orchestrator/edit-bills.orchestrator";
import { EditClient } from "./edit-client";
import { EditChantier } from "./edit-chantier";
import { EditDetail } from "./edit-detail";
import { EditDocument } from "./edit-document";

type stepType = "client" | "chantier" | "details" | "document";

@Component({
    selector: 'app-edit-bills-modal',
    templateUrl: './edit-bills-modal.html',
    imports: [Modal, Button, ReactiveFormsModule, Tabs, EditClient, EditChantier, EditDetail, EditDocument],
})
export class EditBillsModal {
    billId = input<string | null>(null);
    editBillOrchestrator = inject(EditBillsOrchestrator);
    billIdChange = output<string | null>();

    billForm: EditBillForm;

    pdfExistOnBill = computed(() => {
        const currentId = this.billId();
        if (!currentId) return false;
        
        const billInformation = this.editBillOrchestrator.getBillInformationToEdit(currentId);
        return !!billInformation.documentId;
    });

    readonly editionSteps = [
        {
            step: "client" as stepType,
            stepName: "Client",
            primeIcon: "pi pi-user-edit",
        },
        {
            step: "chantier" as stepType,
            stepName: "Chantier",
            primeIcon: "pi pi-briefcase"
        },
        {
            step: "details" as stepType,
            stepName: "Détails",
            primeIcon: "pi pi-file-edit"
        },
        {
            step: "document" as stepType,
            stepName: "Document",
            primeIcon: "pi pi-file"
        }
    ];


    constructor() {
        this.billForm = new EditBillForm({
            clientId: '',
            chantierId: '',
            amountTTC: 0,
            dueDate: new Date(),
            invoiceNumber: '',
            type: 'Situation',
            paymentMode: 'Virement',
            reminderScenarioId: null
        });

        effect(() => {
            const currentBillId = this.billId();
            if (!currentBillId) {
                return;
            }

            const billInformation = this.editBillOrchestrator.getBillInformationToEdit(currentBillId);

            this.billForm.patchValue({
                [BillFormField.ClientId]: billInformation.clientId,
                [BillFormField.ChantierId]: billInformation.chantierId,
                [BillFormField.AmountTTC]: billInformation.amount,
                [BillFormField.DueDate]: billInformation.dueDate,
                [BillFormField.InvoiceNumber]: billInformation.invoiceNumber,
                [BillFormField.Type]: billInformation.type as TypeBill,
                [BillFormField.PaymentMode]: billInformation.paymentMode as PaymentMode,
                [BillFormField.ReminderScenarioId]: billInformation.reminderScenarioId
            });
        });

    }

    closeModal() {
        this.billIdChange.emit(null);
    }

    async editBill() {
        const currentBillId = this.billId();
        const formValue = this.billForm.formValue;

        if (this.billForm.invalid) {
            return;
        }

        const { amountTTC, chantierId, clientId, dueDate, invoiceNumber, type, paymentMode, reminderScenarioId } = formValue;

        await this.editBillOrchestrator.editBillProcess({
            billId: currentBillId!,
            type: type,
            amount: amountTTC,
            chantier: chantierId,
            client: clientId,
            dueDate: dueDate,
            invoiceNumber: invoiceNumber,
            paymentMode: paymentMode,
            reminderScenarioId: reminderScenarioId,
            billPdfFile: formValue.billPdf
        });
    }
}