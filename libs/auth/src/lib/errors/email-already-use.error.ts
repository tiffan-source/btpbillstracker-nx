import { CoreError } from "@btpbilltracker/chore";

export class EmailAlreadyUseError extends CoreError {
    constructor(email: string) {
        super('EMAIL_ALREADY_USE', `L'email ${email} est déjà utilisé`);
    }
}