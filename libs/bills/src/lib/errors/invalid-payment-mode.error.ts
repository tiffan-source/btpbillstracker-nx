import { CoreError } from '@btpbilltracker/chore';
import { BILL_VALIDATION_MESSAGES } from '../values/bill.constraints';

export class InvalidPaymentModeError extends CoreError {
  constructor() {
    super('INVALID_PAYMENT_MODE', BILL_VALIDATION_MESSAGES.PAYMENT_MODE_INVALID);
  }
}

