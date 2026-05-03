import { CoreError } from "@btpbilltracker/chore";

export class ContactRequiredError extends CoreError {
    constructor(message = 'At least one contact (email or phone) is required') {
        super('CONTACT_REQUIRED', message);
    }
}