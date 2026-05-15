import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BillForm, BillFormField, PaymentMode, TypeBill } from "./bill.form.type";



export class CreateBillForm extends FormGroup<BillForm> {
    constructor() {
        // We will assume clientId and chantierId are the first option wich are required, and if the user want to create a new client or chantier, the form will be updated to require the newClientName or newChantierName instead and disable the clientId or chantierId
        super({
            [BillFormField.ClientId] : new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
            [BillFormField.ChantierId] : new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
            [BillFormField.AmountTTC] : new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
            [BillFormField.DueDate] : new FormControl<Date>(new Date(), { nonNullable: true, validators: [Validators.required] }),
            [BillFormField.InvoiceNumber] : new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
            [BillFormField.Type] : new FormControl<TypeBill>('Solde', { nonNullable: true }),
            [BillFormField.PaymentMode] : new FormControl<PaymentMode>('Virement', { nonNullable: true }),
            [BillFormField.ReminderScenarioId] : new FormControl<string | null>(null, {nonNullable: false}),
            [BillFormField.BillPdf] : new FormControl<File | null>(null, { nonNullable: false })
        });

        this.toogleReminderScenario(true);
    }

    get formValue() {
        return this.getRawValue();
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
