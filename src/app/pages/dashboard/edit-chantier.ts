import { Component, inject, input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Button, Divider, Input, InputSelect, Label } from "@btpbilltracker/components";
import { BillFormField } from "src/app/forms/bill.form.type";
import { ChantierFormField, CreateChantierForm } from "src/app/forms/chantier.form";
import { EditBillForm } from "src/app/forms/edit-bill.form";
import { ChantierOrchestrator } from "src/app/services/chantiers/orchestrator/chantier.orchestrator";

@Component({
    selector: 'app-edit-chantier',
    templateUrl: './edit-chantier.html',
    imports: [ReactiveFormsModule, Label, InputSelect, Divider, Input, Button]
})
export class EditChantier {
    parentForm = input.required<EditBillForm>();
    readonly chantierForm = new CreateChantierForm();
    protected readonly ChantierFormField = ChantierFormField;
    protected readonly BillFormField = BillFormField;

    readonly chantierOrchestrator = inject(ChantierOrchestrator);

    async createChantier(): Promise<void> {
        const chantierFormValue = this.chantierForm.value;

        if (this.chantierForm.invalid) {
            this.chantierForm.markAllAsTouched();
            return;
        }

        const { chantierName } = chantierFormValue;
        let result = null;

        if (chantierName) 
            result = await this.chantierOrchestrator.createChantier(chantierName);
        
        if (result) {
            this.parentForm().patchValue({
                [BillFormField.ChantierId]: result
            });
        }
    }
}