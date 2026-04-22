import { Component, effect, inject } from '@angular/core';
import { Button, Card, DatePicker, Input, InputFile, InputSelect, Label, Toogle, PageTitle, PageSubTitle, Toast, ToastService, TextError, Modal, Spiner } from "@btpbilltracker/components"
import { ReactiveFormsModule } from '@angular/forms';
import { CreateBillForm} from '../../forms/create-bill.form';
import { BillFormField, PaymentMode, TypeBill } from 'src/app/forms/bill.form.type';
import { ClientsOrchestrator } from 'src/app/services/clients/orchestrator/clients.orchestrator';
import { ChantierOrchestrator } from 'src/app/services/chantiers/orchestrator/chantier.orchestrator';
import { CreateBillsOrchestrator } from 'src/app/services/bills/create-bills/orchestrator/create-bills.orchestrator';

@Component({
  selector: 'app-create-bills',
  imports: [Card, Input, ReactiveFormsModule, InputSelect, Label, Button, DatePicker, InputFile, Toogle, PageTitle, PageSubTitle, Toast, TextError, Modal, Spiner],
  templateUrl: './create-bills.html',
})

export class CreateBills {
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

    billsOrchestrator = inject(CreateBillsOrchestrator);
    clientOrchestrator = inject(ClientsOrchestrator);
    chantierOrchestrator = inject(ChantierOrchestrator);
    toastService = inject(ToastService);

    hasSubmittedInvalidForm = false;

    billForm = new CreateBillForm();

    constructor() {
        effect(() => {
            const error = this.billsOrchestrator.processError();
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

    onFileChange(file: File | null): void {
        this.billForm.patchValue({
        [BillFormField.BillPdf]: file
        });
        
        this.billForm.controls[BillFormField.BillPdf].updateValueAndValidity();
    }

    async createBill(): Promise<void> {
        const formValue = this.billForm.formValue;

        if (this.billForm.invalid) {
            this.hasSubmittedInvalidForm = true;
            this.billForm.markAllAsTouched();
            this.toastService.showToast('error', 'Veuillez corriger les erreurs du formulaire');
            return;
        }
        
        const { amountTTC, chantierId, chantierName, clientId, dueDate, invoiceNumber, type, paymentMode, reminderScenarioId, newClientName } = formValue;

        const result = await this.billsOrchestrator.createBillProcess({
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
            reminderScenarioId: reminderScenarioId,
            billPdfFile: formValue.billPdf
        });
        
        if (result.success) {
            this.toastService.showToast('success', 'Facture créée avec succès');
            this.billForm.reset();
            this.billForm.markAsUntouched();
            this.hasSubmittedInvalidForm = false;
        }
    }
}
