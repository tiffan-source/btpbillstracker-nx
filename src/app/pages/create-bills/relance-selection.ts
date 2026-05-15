import { Component, inject, input, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Button, Card, InputSelect, Label, Toogle } from "@btpbilltracker/components";
import { BillFormField } from "src/app/forms/bill.form.type";
import { CreateBillForm } from "src/app/forms/create-bill.form";
import { MessageTemplateOrchestrator } from "src/app/services/messageTemplate/orchestrator/message-template.orchestrator";

@Component({
    selector: 'app-relance-selection',
    imports: [Card, Label, InputSelect, ReactiveFormsModule, Toogle, Button],
    templateUrl: './relance-selection.html',
})
export class RelanceSelection {
    parentForm = input.required<CreateBillForm>();
    protected readonly BillFormField = BillFormField;
    protected readonly messageOrchestrator = inject(MessageTemplateOrchestrator);
    isCreatingBill = input<boolean>();
    
    setReminderEnabled(isEnabled: boolean): void {
        this.parentForm().toogleReminderScenario(isEnabled);
    }    

    get isReminderEnabled(): boolean {
        return this.parentForm().isReminderEnabled();
    }

    readonly goPrevious = output<void>(); // <-- Événement
    readonly done = output<void>(); // <-- Événement

}