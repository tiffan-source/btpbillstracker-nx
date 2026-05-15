import { FormControl, FormGroup } from "@angular/forms"

export enum ChantierFormField {
    ChantierName = 'chantierName'
}

export type ChantierForm = {
    [ChantierFormField.ChantierName]: FormControl<string>
}

export class CreateChantierForm extends FormGroup<ChantierForm> {
    constructor() {
        super({
            [ChantierFormField.ChantierName]: new FormControl<string>('', { nonNullable: true })
        });
    }

}