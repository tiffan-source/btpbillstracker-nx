import { FormControl, FormGroup } from "@angular/forms"

export enum NewUserFormField {
  EMAIL = 'email',
  PASSWORD = 'password',
  CONFIRM_PASSWORD = 'confirmPassword'
}

export type NewUserForm = {
  [NewUserFormField.EMAIL] : FormControl<string>,
  [NewUserFormField.PASSWORD] : FormControl<string>,
  [NewUserFormField.CONFIRM_PASSWORD] : FormControl<string>
}

export class RegisterForm extends FormGroup<NewUserForm> {

  constructor() {
    super({
      [NewUserFormField.EMAIL] : new FormControl<string>('', { nonNullable: true, validators: [] }),
      [NewUserFormField.PASSWORD] : new FormControl<string>('', { nonNullable: true, validators: [] }),
      [NewUserFormField.CONFIRM_PASSWORD] : new FormControl<string>('', { nonNullable: true, validators: [] })
    })
  }

}