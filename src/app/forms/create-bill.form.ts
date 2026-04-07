import { FormControl, FormGroup, Validators } from "@angular/forms";

export enum BillFormField {
    ClientId = 'clientId',
    NewClientName = 'newClientName',
    ChantierId = 'chantierId',
    NewChantierName = 'chantierName',
    AmountTTC = 'amountTTC',
    DueDate = 'dueDate',
    InvoiceNumber = 'invoiceNumber',
    Type = 'type',
    PaymentMode = 'paymentMode',
    ReminderScenarioId = 'reminderScenarioId'
}

export type BillForm = {
    [BillFormField.ClientId] : FormControl<string | null>,
    [BillFormField.NewClientName] : FormControl<string | null>,
    [BillFormField.ChantierId] : FormControl<string | null>,
    [BillFormField.NewChantierName] : FormControl<string | null>,
    [BillFormField.AmountTTC] : FormControl<number>,
    [BillFormField.DueDate] : FormControl<string>,
    [BillFormField.InvoiceNumber] : FormControl<string>,
    [BillFormField.Type] : FormControl<TypeBill>,
    [BillFormField.PaymentMode] : FormControl<PaymentMode>,
    [BillFormField.ReminderScenarioId] : FormControl<string | null>
}


export type TypeBill = 'Situation' | 'Solde' | 'Acompte';
export type PaymentMode = 'Virement' | 'Chèque' | 'Espèces' | 'Carte bancaire';

export class CreateBillForm extends FormGroup<BillForm> {
    constructor() {
        // We will assume clientId and chantierId are the first option wich are required, and if the user want to create a new client or chantier, the form will be updated to require the newClientName or newChantierName instead and disable the clientId or chantierId
        super({
            [BillFormField.ClientId] : new FormControl<string | null>(null, {nonNullable: false, validators: [Validators.required]}),
            [BillFormField.NewClientName] : new FormControl<string | null>(null, {nonNullable: false}),
            [BillFormField.ChantierId] : new FormControl<string | null>(null, {nonNullable: false, validators: [Validators.required]}),
            [BillFormField.NewChantierName] : new FormControl<string | null>(null, {nonNullable: false}),
            [BillFormField.AmountTTC] : new FormControl<number>(0, { nonNullable: true, validators: [Validators.min(0)] }),
            [BillFormField.DueDate] : new FormControl<string>('', { nonNullable: true }),
            [BillFormField.InvoiceNumber] : new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
            [BillFormField.Type] : new FormControl<TypeBill>('Solde', { nonNullable: true }),
            [BillFormField.PaymentMode] : new FormControl<PaymentMode>('Virement', { nonNullable: true }),
            [BillFormField.ReminderScenarioId] : new FormControl<string | null>(null, {nonNullable: false})
        });
    }

    get formValue() {
        return this.getRawValue();
    }

    toogleNewClientMode(isNewClientMode: boolean) {
        if(isNewClientMode) {
            this.controls[BillFormField.ClientId].setValue(null);
            this.controls[BillFormField.ClientId].disable();
            this.controls[BillFormField.NewClientName].removeValidators([Validators.required]);
            this.controls[BillFormField.NewClientName].enable();
            this.controls[BillFormField.NewClientName].setValidators([Validators.required]);
            this.controls[BillFormField.NewClientName].updateValueAndValidity();
        } else {
            this.controls[BillFormField.NewClientName].setValue(null);
            this.controls[BillFormField.NewClientName].disable();
            this.controls[BillFormField.NewClientName].removeValidators([Validators.required]);
            this.controls[BillFormField.ClientId].enable();
            this.controls[BillFormField.ClientId].setValidators([Validators.required]);
            this.controls[BillFormField.ClientId].updateValueAndValidity();
        }
    }

    toogleNewChantierMode(isNewChantierMode: boolean) {
        if(isNewChantierMode) {
            this.controls[BillFormField.ChantierId].setValue(null);
            this.controls[BillFormField.ChantierId].disable();
            this.controls[BillFormField.NewChantierName].enable();
            this.controls[BillFormField.NewChantierName].setValidators([Validators.required]);
            this.controls[BillFormField.NewChantierName].updateValueAndValidity();
        } else {
            this.controls[BillFormField.NewChantierName].setValue(null);
            this.controls[BillFormField.NewChantierName].disable();
            this.controls[BillFormField.ChantierId].enable();
            this.controls[BillFormField.ChantierId].setValidators([Validators.required]);
            this.controls[BillFormField.ChantierId].updateValueAndValidity();
        }
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