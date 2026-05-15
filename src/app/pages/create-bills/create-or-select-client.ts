import { Component, effect, inject, input, signal, output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Button, InputSelect, Label, Input, Card } from "@btpbilltracker/components"
import { BillFormField } from "src/app/forms/bill.form.type";
import { ClientFormField, CreateClientForm } from "src/app/forms/client.form";
import { CreateBillForm } from "src/app/forms/create-bill.form";
import { ClientsOrchestrator } from "src/app/services/clients/orchestrator/clients.orchestrator";
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'clientNameFromId',
})
export class ClientNameFromIdPipe implements PipeTransform {
    clientOrchestrator = inject(ClientsOrchestrator);

    transform(value: string | null): string {
        const clients = this.clientOrchestrator.clientOptions();
        const client = clients.find(client => client.value === value)?.label || '';
        return client;
    }
}

@Component({
    selector: 'app-create-or-select-client',
    imports: [Card, Input, ReactiveFormsModule, InputSelect, Label, Button, ClientNameFromIdPipe],
    templateUrl: './create-or-select-client.html',
})
export class CreateOrSelectClient {
    protected readonly  clientForm = new CreateClientForm()
    readonly  parentForm = input.required<CreateBillForm>();
    protected readonly clientOrchestrator = inject(ClientsOrchestrator);

    protected readonly BillFormField = BillFormField;
    protected readonly ClientFormField = ClientFormField;

    readonly goNext = output<void>(); // <-- Événement

    mode = signal('select');

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