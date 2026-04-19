import { FormControl, FormGroup, Validators } from "@angular/forms"
import { BillFormField, PaymentMode, TypeBill } from "./bill.form.type"

type BillForm = {
    [BillFormField.ClientId] : FormControl<string | null>,
    [BillFormField.NewClientName] : FormControl<string | null>,
    [BillFormField.ChantierId] : FormControl<string | null>,
    [BillFormField.NewChantierName] : FormControl<string | null>,
    [BillFormField.AmountTTC] : FormControl<number>,
    [BillFormField.DueDate] : FormControl<Date | null>,
    [BillFormField.InvoiceNumber] : FormControl<string>,
    [BillFormField.Type] : FormControl<TypeBill>,
    [BillFormField.PaymentMode] : FormControl<PaymentMode>,
    [BillFormField.ReminderScenarioId] : FormControl<string | null>
}

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

type CreateBillToggleMode = keyof typeof CREATE_BILL_TOGGLE_VALIDATION_RULES;
type CreateBillToggleField =
    | BillFormField.ClientId
    | BillFormField.NewClientName
    | BillFormField.ChantierId
    | BillFormField.NewChantierName;

export class EditBillForm extends FormGroup<BillForm> {
    constructor(initialValue: EditFormType) {
        // Since we are inside en edition form, clientId and chantierId should always have a value (either the existing one or a new one), so we initialize them with empty string and not null, and we will set the correct validators and values in the component based on the bill information.
        super({
            [BillFormField.ClientId] : new FormControl<string>(initialValue.clientId, { nonNullable: true, validators: [Validators.required] }),
            [BillFormField.NewClientName] : new FormControl<string | null>(""),
            [BillFormField.ChantierId] : new FormControl<string>(initialValue.chantierId, { nonNullable: true, validators: [Validators.required] }),
            [BillFormField.NewChantierName] : new FormControl<string | null>(""),
            [BillFormField.AmountTTC] : new FormControl<number>(initialValue.amountTTC, { nonNullable: true, validators: [Validators.min(0)] }),
            [BillFormField.DueDate] : new FormControl<Date>(initialValue.dueDate),
            [BillFormField.InvoiceNumber] : new FormControl<string>(initialValue.invoiceNumber, { nonNullable: true }),
            [BillFormField.Type] : new FormControl<TypeBill>(initialValue.type, { nonNullable: true }),
            [BillFormField.PaymentMode] : new FormControl<PaymentMode>(initialValue.paymentMode, { nonNullable: true }),
            [BillFormField.ReminderScenarioId] : new FormControl<string | null>(initialValue.reminderScenarioId)
        });
    }

    private setControlMode(controlName: CreateBillToggleField, isEnabled: boolean): void {
        const control = this.controls[controlName];
        control.setValue(null);
        control.setValidators([Validators.required]);
        if (isEnabled) {
            control.enable({ emitEvent: false });
        } else {
            control.disable({ emitEvent: false });
        }
        control.updateValueAndValidity({ emitEvent: false });
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
        this.setControlMode(existingField, !isNewMode);
        this.setControlMode(newField, isNewMode);
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