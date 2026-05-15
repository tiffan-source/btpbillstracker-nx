import { Component, effect, inject, input, Pipe, PipeTransform, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Button, Card, Input, InputSelect, Label, Divider } from "@btpbilltracker/components"
import { BillFormField } from "src/app/forms/bill.form.type";
import { ChantierFormField, CreateChantierForm } from "src/app/forms/chantier.form";
import { CreateBillForm } from "src/app/forms/create-bill.form";
import { ChantierOrchestrator } from "src/app/services/chantiers/orchestrator/chantier.orchestrator";


@Pipe({
  name: 'chantierNameFromId',
})
export class ChantierNameFromIdPipe implements PipeTransform {
    chantierOrchestrator = inject(ChantierOrchestrator);

    transform(value: string | null): string {
        const chantiers = this.chantierOrchestrator.chantierOptions();
        const chantier = chantiers.find(chantier => chantier.value === value)?.label || '';
        return chantier;
    }
}

@Component({
    selector: 'app-create-or-select-chantier',
    imports: [Divider, Card, Input, ReactiveFormsModule, InputSelect, Label, Button, ChantierNameFromIdPipe],
    templateUrl: './create-or-select-chantier.html',
})
export class CreateOrSelectChantier {
    readonly parentForm = input.required<CreateBillForm>();
    readonly chantierForm = new CreateChantierForm();
    protected readonly ChantierFormField = ChantierFormField;
    protected readonly BillFormField = BillFormField;
    
    readonly chantierOrchestrator = inject(ChantierOrchestrator);

    readonly goNext = output<void>(); // <-- Événement
    readonly goPrevious = output<void>(); // <-- Événement

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