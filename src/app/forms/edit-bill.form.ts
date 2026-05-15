import { FormControl, FormGroup, Validators } from "@angular/forms"
import { BillForm, BillFormField, PaymentMode, TypeBill } from "./bill.form.type"

type EditFormType = {
    clientId: string;
    chantierId: string;
    amountTTC: number;
    dueDate: Date;
    invoiceNumber: string;
    type: TypeBill;
    paymentMode: PaymentMode;
    reminderScenarioId: string | null;
}

export class EditBillForm extends FormGroup<BillForm> {
    constructor(initialValue: EditFormType) {
        // Since we are inside en edition form, clientId and chantierId should always have a value (either the existing one or a new one), so we initialize them with empty string and not null, and we will set the correct validators and values in the component based on the bill information.
        super({
            [BillFormField.ClientId] : new FormControl<string>(initialValue.clientId, { nonNullable: true, validators: [Validators.required] }),
            [BillFormField.ChantierId] : new FormControl<string>(initialValue.chantierId, { nonNullable: true, validators: [Validators.required] }),
            [BillFormField.AmountTTC] : new FormControl<number>(initialValue.amountTTC, { nonNullable: true, validators: [Validators.min(0)] }),
            [BillFormField.DueDate] : new FormControl<Date>(initialValue.dueDate, { nonNullable: true, validators: [Validators.required] }),
            [BillFormField.InvoiceNumber] : new FormControl<string>(initialValue.invoiceNumber, { nonNullable: true }),
            [BillFormField.Type] : new FormControl<TypeBill>(initialValue.type, { nonNullable: true }),
            [BillFormField.PaymentMode] : new FormControl<PaymentMode>(initialValue.paymentMode, { nonNullable: true }),
            [BillFormField.ReminderScenarioId] : new FormControl<string | null>(initialValue.reminderScenarioId),
            [BillFormField.BillPdf] : new FormControl<File | null>(null)
        });
    }

    isReminderEnabled(): boolean {
        return this.controls[BillFormField.ReminderScenarioId].enabled;
    }

    toogleReminderScenario(isEnabled: boolean): void {
        const controlName = BillFormField.ReminderScenarioId;
        const control = this.controls[controlName];
        if (isEnabled) {
            control.setValidators([Validators.required]);
            control.enable({ emitEvent: false });
        } else {
            control.setValue(null);
            control.clearValidators();
            control.disable({ emitEvent: false });
        }
        control.updateValueAndValidity({ emitEvent: false });
    }

    get formValue() {
        return this.getRawValue();
    }

    getErrors(controlName: BillFormField): string | null {
        const control = this.controls[controlName];
        if (!control || !control.errors) {
            return null;
        }
        const errors = control.errors;
        
        if (errors['required']) {
            return 'Ce champ est requis';
        }
        if (errors['min']) {
            return `La valeur doit être supérieure ou égale à ${errors['min'].min}`;
        }
        return 'Champ invalide';
    }
}