import { Component, effect, inject, OnInit } from '@angular/core';
import { Button, Card, DatePicker, Input, InputFile, InputSelect, Label, Toogle, PageTitle, PageSubTitle, Toast, ToastService, TextError } from "@btpbilltracker/components"
import { ReactiveFormsModule } from '@angular/forms';
import { CreateBillForm, BillFormField, TypeBill, PaymentMode } from 'src/app/forms/create-bill.form';
import { CreateBillsOrchestrator } from 'src/app/services/create-bills/orchestrator/create-bills.orchestrator';

@Component({
  selector: 'app-create-bills',
  imports: [Card, Input, ReactiveFormsModule, InputSelect, Label, Button, DatePicker, InputFile, Toogle, PageTitle, PageSubTitle, Toast, TextError],
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

    orchestrator = inject(CreateBillsOrchestrator);
    toastService = inject(ToastService);

    isCreatingNewClient = false;
    isCreatingNewChantier = false;

    hasSubmittedInvalidForm = false;

    billForm = new CreateBillForm();

    constructor() {
        effect(() => {
            let error = this.orchestrator.processError();
            if (error) {
                this.toastService.showToast('error', error);
            }
        })
    }

    toggleNewClientMode() {
        this.isCreatingNewClient = !this.isCreatingNewClient;
        this.billForm.toogleNewClientMode(this.isCreatingNewClient);
    }

    toggleNewChantierMode() {
        this.isCreatingNewChantier = !this.isCreatingNewChantier;
        this.billForm.toogleNewChantierMode(this.isCreatingNewChantier);
    }

    fieldHasError(field: BillFormField): boolean {
        const control = this.billForm.controls[field];        
        return !!(control && control.invalid && this.hasSubmittedInvalidForm);
    }

    fieldErrorMessage(field: BillFormField): string | null {
        return this.billForm.getErrors(field);
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
        
        let result = await this.orchestrator.createBillProcess({
            amount: amountTTC,
            chantier: {
                id: chantierId,
                name: chantierName
            },
            client: {
                id: clientId,
                name: newClientName
            },
            dueDate: new Date(dueDate),
            invoiceNumber: invoiceNumber,
            type: type,
            paymentMode: paymentMode,
            reminderScenarioId: reminderScenarioId
        });
        
        if (result) {
            this.toastService.showToast('success', 'Facture créée avec succès');
            this.billForm.reset();
            this.billForm.markAsUntouched();
            this.hasSubmittedInvalidForm = false;
        }
    }
}
