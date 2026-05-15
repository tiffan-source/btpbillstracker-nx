import { FormControl, FormGroup, Validators } from "@angular/forms";

export enum ClientFormField {
    Firstname = 'firstname',
    Lastname = 'lastname',
    PhoneNumber = 'phoneNumber',
    Email = 'email'
}

type ClientForm = {
    [ClientFormField.Firstname]: FormControl<string>,
    [ClientFormField.Lastname]: FormControl<string>,
    [ClientFormField.PhoneNumber]: FormControl<string | null>,
    [ClientFormField.Email]: FormControl<string | null>
}

export class CreateClientForm extends FormGroup<ClientForm> {
    constructor() {
        super({
            [ClientFormField.Firstname]: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
            [ClientFormField.Lastname]: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
            [ClientFormField.PhoneNumber]: new FormControl<string | null>(null),
            [ClientFormField.Email]: new FormControl<string | null>(null)
        });
    }
}