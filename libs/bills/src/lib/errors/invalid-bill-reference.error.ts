import { BILL_VALIDATION_MESSAGES } from '../values/bill.constraints';
import { CoreError } from '@btpbilltracker/chore';

export class InvalidBillReferenceError extends CoreError {
  constructor() {
    super('INVALID_BILL_REFERENCE', BILL_VALIDATION_MESSAGES.INVALID_REFERENCE);
  }
}

