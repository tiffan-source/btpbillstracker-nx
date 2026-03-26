import { BILL_VALIDATION_MESSAGES } from '../values/bill.constraints';
import { CoreError } from '@btpbilltracker/chore';

export class BillClientRequiredError extends CoreError {
  constructor() {
    super('BILL_CLIENT_REQUIRED', BILL_VALIDATION_MESSAGES.CLIENT_REQUIRED);
  }
}

