import { FormControl, FormGroup } from "@angular/forms"

export enum AuthFormField {
    Email = 'email',
    Password = 'password'
}

export type AuthForm = {
    [AuthFormField.Email] : FormControl<string>,
    [AuthFormField.Password] : FormControl<string>
}

export class LoginForm extends FormGroup<AuthForm> {

    constructor() {
        super({
            [AuthFormField.Email] : new FormControl<string>('', { nonNullable: true, validators: [] }),
            [AuthFormField.Password] : new FormControl<string>('', { nonNullable: true, validators: [] })
        })
    }

}
