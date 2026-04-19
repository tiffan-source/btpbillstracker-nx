import { Component, effect, inject, input, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Modal, Button, Label, TextError, Input, InputSelect, DatePicker, InputFile, ToastService } from "@btpbilltracker/components";
import { BillFormField, PaymentMode, TypeBill } from "src/app/forms/bill.form.type";
import { EditBillForm } from "src/app/forms/edit-bill.form";
import { ChantierOrchestrator } from "src/app/services/chantiers/orchestrator/chantier.orchestrator";
import { ClientsOrchestrator } from "src/app/services/clients/orchestrator/clients.orchestrator";
import { EditBillsOrchestrator } from "src/app/services/edit-bills/orchestrator/edit-bills.orchestrator";

@Component({
    selector: 'app-edit-bills-modal',
    templateUrl: './edit-bills-modal.html',
    imports: [Modal, Button, ReactiveFormsModule, Label, TextError, Input, InputSelect, DatePicker, InputFile],
})
export class EditBillsModal {
    editBillOrchestrator = inject(EditBillsOrchestrator);
    billId = input<string | null>(null);
    billIdChange = output<string | null>();
    billForm: EditBillForm;
    hasSubmittedInvalidForm = false;
    clientOrchestrator = inject(ClientsOrchestrator);
    chantierOrchestrator = inject(ChantierOrchestrator);
    toastService = inject(ToastService);

    protected readonly BillFormField = BillFormField;
    protected readonly typeOptions: { label: string, value: TypeBill }[] = [
        { label: "Situation", value: "Situation" },
        { label: "Solde", value: "Solde" },
        { label: "Acompte", value: "Acompte" },
    ];
    protected readonly paymentModeOptions: { label: string, value: PaymentMode }[] = [
        { label: "Virement", value: "Virement" },
        { label: "Chèque", value: "Chèque" },
        { label: "Espèces", value: "Espèces" },
        { label: "Carte bancaire", value: "Carte bancaire" },
    ]

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
                [BillFormField.NewClientName]: '',
                [BillFormField.ChantierId]: billInformation.chantierId,
                [BillFormField.NewChantierName]: '',
                [BillFormField.AmountTTC]: billInformation.amount,
                [BillFormField.DueDate]: billInformation.dueDate,
                [BillFormField.InvoiceNumber]: billInformation.invoiceNumber,
                [BillFormField.Type]: billInformation.type as TypeBill,
                [BillFormField.PaymentMode]: billInformation.paymentMode as PaymentMode,
                [BillFormField.ReminderScenarioId]: billInformation.reminderScenarioId
            });

            this.hasSubmittedInvalidForm = false;
        });

        effect(() => {
            const error = this.editBillOrchestrator.processError();
            if (error) {
                this.toastService.showToast('error', error);
            }
        })
    }

    toggleNewClientMode() {
        this.billForm.toggleMode('client');
    }

    toggleNewChantierMode() {
        this.billForm.toggleMode('chantier');
    }

    get isCreatingNewClient(): boolean {
        return this.billForm.isInNewMode('client');
    }

    get isCreatingNewChantier(): boolean {
        return this.billForm.isInNewMode('chantier');
    }

    fieldHasError(field: BillFormField): boolean {
        const control = this.billForm.controls[field];        
        return !!(control && control.invalid && this.hasSubmittedInvalidForm);
    }

    fieldErrorMessage(field: BillFormField): string | null {
        return this.billForm.getErrors(field);
    }

    closeModal() {
        this.billIdChange.emit(null);
    }


    async editBill(): Promise<void> {
        const currentBillId = this.billId();
        if (!currentBillId) {
            this.toastService.showToast('error', 'Aucune facture a modifier');
            return;
        }

        const formValue = this.billForm.formValue;

        if (this.billForm.invalid) {
            this.hasSubmittedInvalidForm = true;
            this.billForm.markAllAsTouched();
            this.toastService.showToast('error', 'Veuillez corriger les erreurs du formulaire');
            return;
        }
        
        const { amountTTC, chantierId, chantierName, clientId, dueDate, invoiceNumber, type, paymentMode, reminderScenarioId, newClientName } = formValue;

        const result = await this.editBillOrchestrator.editBillProcess({
            billId: currentBillId,
            amount: amountTTC,
            chantier: this.isCreatingNewChantier
                ? { mode: 'new', chantierName: chantierName ?? '' }
                : { mode: 'existing', chantierId: chantierId ?? '' },
            client: this.isCreatingNewClient
                ? { mode: 'new', clientName: newClientName ?? '' }
                : { mode: 'existing', clientId: clientId ?? '' },
            dueDate: dueDate?.toDateString() ?? '',
            invoiceNumber: invoiceNumber,
            type: type,
            paymentMode: paymentMode,
            reminderScenarioId: reminderScenarioId
        });
        
        if (result.success) {
            this.toastService.showToast('success', 'Facture modifiee avec succes');
            this.closeModal();
        }
    }
}