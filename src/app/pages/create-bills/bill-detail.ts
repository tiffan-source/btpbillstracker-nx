import { formatPercent } from "@angular/common";
import { Component, output, input, computed } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Toast, Card, Input, InputSelect, Label, Button, DatePicker,  } from "@btpbilltracker/components";
import { paymentModeOptions } from "src/app/constants/payment-mode.options";
import { typeOptions } from "src/app/constants/type.options";
import { BillFormField, PaymentMode, TypeBill } from "src/app/forms/bill.form.type";
import { CreateBillForm } from "src/app/forms/create-bill.form";

@Component({
    selector: 'app-bill-detail',
    imports: [Card, Input, ReactiveFormsModule, InputSelect, Label, Button, DatePicker],
    templateUrl: './bill-detail.html',
})
export class BillDetail {
    readonly  parentForm = input.required<CreateBillForm>();
    protected readonly BillFormField = BillFormField;
    
    protected readonly typeOptions = typeOptions;

    protected readonly paymentModeOptions: { label: string, value: PaymentMode }[] = paymentModeOptions;

    readonly goNext = output<void>(); // <-- Événement
    readonly goPrevious = output<void>(); // <-- Événement

    isFieldInvalid = (controlName: BillFormField) => {
        const control = this.parentForm().controls[controlName];
        return control.invalid && (control.dirty || control.touched);
    };

    isStepValid = () => {
        const form = this.parentForm().controls;
        return form[BillFormField.AmountTTC].valid && 
            form[BillFormField.DueDate].valid && 
            form[BillFormField.InvoiceNumber].valid &&
            form[BillFormField.Type].valid &&
            form[BillFormField.PaymentMode].valid;
    };
}