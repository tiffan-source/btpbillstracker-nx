import { CoreError } from "@btpbilltracker/chore";

export class LoginWithEmailAndPasswordError extends CoreError {
    constructor() {
        super('LOGIN_CREDENTIAL_INVALID', 'Email ou mot de passe invalide');
    }
}