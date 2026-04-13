import { CoreError } from "@btpbilltracker/chore";

export class NotSamePasswordError extends CoreError {
    constructor() {
        super('NOT_SAME_PASSWORD', 'Les mots de passe ne correspondent pas');
    }
}