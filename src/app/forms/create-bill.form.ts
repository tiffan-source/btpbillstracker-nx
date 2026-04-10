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

const CREATE_BILL_TOGGLE_VALIDATION_RULES = {
    client: {
        existingField: BillFormField.ClientId,
        newField: BillFormField.NewClientName
    },
    chantier: {
        existingField: BillFormField.ChantierId,
        newField: BillFormField.NewChantierName
    }
} as const;

type CreateBillToggleMode = keyof typeof CREATE_BILL_TOGGLE_VALIDATION_RULES;
type CreateBillToggleField = (typeof CREATE_BILL_TOGGLE_VALIDATION_RULES)[CreateBillToggleMode][keyof (typeof CREATE_BILL_TOGGLE_VALIDATION_RULES)[CreateBillToggleMode]];

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

        this.setMode('client', false);
        this.setMode('chantier', false);
    }

    get formValue() {
        return this.getRawValue();
    }

    isInNewMode(mode: CreateBillToggleMode): boolean {
        return this.controls[CREATE_BILL_TOGGLE_VALIDATION_RULES[mode].existingField].disabled;
    }

    toggleMode(mode: CreateBillToggleMode): void {
        this.setMode(mode, !this.isInNewMode(mode));
    }

    setMode(mode: CreateBillToggleMode, isNewMode: boolean): void {
        const { existingField, newField } = CREATE_BILL_TOGGLE_VALIDATION_RULES[mode];
        this.setControlMode(existingField, !isNewMode, true);
        this.setControlMode(newField, isNewMode, true);
    }

    private setControlMode(controlName: CreateBillToggleField, isEnabled: boolean, isRequired: boolean): void {
        const control = this.controls[controlName];
        control.setValue(null);
        control.setValidators(isRequired ? [Validators.required] : []);
        if (isEnabled) {
            control.enable({ emitEvent: false });
        } else {
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
