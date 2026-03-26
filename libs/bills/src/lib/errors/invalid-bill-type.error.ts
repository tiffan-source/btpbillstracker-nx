import { BILL_VALIDATION_MESSAGES } from '../values/bill.constraints';
import { CoreError } from '@btpbilltracker/chore';

export class InvalidBillTypeError extends CoreError {
  constructor() {
    super('INVALID_BILL_TYPE', BILL_VALIDATION_MESSAGES.TYPE_INVALID);
  }
}

