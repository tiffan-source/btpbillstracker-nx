import { Component, inject, input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { DatePicker, Input, InputSelect, Label, Toogle } from "@btpbilltracker/components";
import { paymentModeOptions } from "src/app/constants/payment-mode.options";
import { typeOptions } from "src/app/constants/type.options";
import { BillFormField } from "src/app/forms/bill.form.type";
import { EditBillForm } from "src/app/forms/edit-bill.form";
import { MessageTemplateOrchestrator } from "src/app/services/messageTemplate/orchestrator/message-template.orchestrator";

@Component({
    selector: 'app-edit-detail',
    templateUrl: './edit-detail.html',
    imports: [ReactiveFormsModule, Label, Input, InputSelect, Toogle, DatePicker]
})
export class EditDetail {
    parentForm = input.required<EditBillForm>();
    protected readonly BillFormField = BillFormField;
    protected readonly messageOrchestrator = inject(MessageTemplateOrchestrator);
    protected readonly typeOptions = typeOptions;
    protected readonly paymentModeOptions = paymentModeOptions;

        setReminderEnabled(isEnabled: boolean): void {
        this.parentForm().toogleReminderScenario(isEnabled);
    }    

    get isReminderEnabled(): boolean {
        return this.parentForm().isReminderEnabled();
    }
}