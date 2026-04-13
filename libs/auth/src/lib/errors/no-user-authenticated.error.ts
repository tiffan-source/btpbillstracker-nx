import { CoreError } from "@btpbilltracker/chore";

export class NoUserAuthenticatedError extends CoreError {
    constructor() {
        super('NO_USER_AUTHENTICATED', 'No user is currently authenticated');
    }
}