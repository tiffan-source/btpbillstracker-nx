import { Component, inject, input, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Button, Input, InputSelect, Label } from "@btpbilltracker/components";
import { BillFormField } from "src/app/forms/bill.form.type";
import { ClientFormField, CreateClientForm } from "src/app/forms/client.form";
import { EditBillForm } from "src/app/forms/edit-bill.form";
import { ClientsOrchestrator } from "src/app/services/clients/orchestrator/clients.orchestrator";

@Component({
    selector: 'app-edit-client',
    templateUrl: './edit-client.html',
    imports: [Button, Input, ReactiveFormsModule, Label, InputSelect]
})
export class EditClient {
    parentForm = input.required<EditBillForm>();
    clientOrchestrator = inject(ClientsOrchestrator);
    protected readonly BillFormField = BillFormField;
    

    mode = signal<'select' | 'create'>('select');
    clientForm = new CreateClientForm();
    protected readonly ClientFormField = ClientFormField;

    selectMode(mode: 'select' | 'create'): void {
        this.mode.set(mode);
    }


    async createClient(): Promise<void> {
        const clientFormValue = this.clientForm.value;

        if (this.clientForm.invalid) {
            this.clientForm.markAllAsTouched();
            return;
        }

        const { firstname, lastname, email, phoneNumber } = clientFormValue;

        if (firstname && lastname ) {
            let clientId = await this.clientOrchestrator.createClient({
                firstName: firstname,
                lastName: lastname,
                email: email || undefined,
                phoneNumber: phoneNumber || undefined
            });

            if (clientId) {
                this.parentForm().patchValue({
                    clientId: clientId
                });
                this.selectMode('select');
            }
        }
    }
}