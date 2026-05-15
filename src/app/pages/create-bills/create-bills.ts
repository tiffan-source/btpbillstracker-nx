import { Component, inject, signal } from '@angular/core';
import { PageTitle, PageSubTitle} from "@btpbilltracker/components"
import { ReactiveFormsModule } from '@angular/forms';
import { CreateBillForm} from '../../forms/create-bill.form';
import { BillFormField } from 'src/app/forms/bill.form.type';
import { CreateBillsOrchestrator } from 'src/app/services/bills/create-bills/orchestrator/create-bills.orchestrator';
import { CreateOrSelectClient } from './create-or-select-client';
import { CreateOrSelectChantier } from './create-or-select-chantier';
import { BillDetail } from './bill-detail';
import { UploadPdf } from "./upload-pdf";
import { RelanceSelection } from './relance-selection';

@Component({
  selector: 'app-create-bills',
  imports: [ReactiveFormsModule, PageTitle, PageSubTitle, CreateOrSelectClient, CreateOrSelectChantier, BillDetail, UploadPdf, RelanceSelection],
  templateUrl: './create-bills.html',
})

export class CreateBills {
    billsOrchestrator = inject(CreateBillsOrchestrator);

    protected readonly BillFormField = BillFormField;

    steps = signal<('client' | 'chantier' | 'details' | 'pdf' | 'relance')>('client');

    nextStep(): void {
        const currentStep = this.steps();
        if (currentStep === 'client') {
            this.steps.set('chantier');
        } else if (currentStep === 'chantier') {
            this.steps.set('details');
        } else if (currentStep === 'details') {
            this.steps.set('pdf');
        } else if (currentStep === 'pdf') {
            this.steps.set('relance');
        }
    }

    previousStep(): void {
        const currentStep = this.steps();
        if (currentStep === 'relance') {
            this.steps.set('pdf');
        } else if (currentStep === 'pdf') {
            this.steps.set('details');
        } else if (currentStep === 'details') {
            this.steps.set('chantier');
        } else if (currentStep === 'chantier') {
            this.steps.set('client');
        }
    }

    hasSubmittedInvalidForm = false;

    billForm = new CreateBillForm();

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
            return;
        }
        
        const { amountTTC, chantierId, clientId, dueDate, invoiceNumber, type, paymentMode, reminderScenarioId, billPdf } = formValue;

        await this.billsOrchestrator.createBillProcess({
            amount: amountTTC,
            invoiceNumber: invoiceNumber,
            type: type,
            paymentMode: paymentMode,
            reminderScenarioId: reminderScenarioId,
            billPdfFile: billPdf,
            chantier: chantierId,
            client: clientId,
            dueDate: dueDate
        });

        this.billForm.reset();
        this.billForm.markAsUntouched();
        this.hasSubmittedInvalidForm = false;
    }
}
