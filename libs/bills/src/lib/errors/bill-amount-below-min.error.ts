import { BILL_VALIDATION_MESSAGES } from '../values/bill.constraints';
import { CoreError } from '@btpbilltracker/chore';

export class BillAmountBelowMinError extends CoreError {
  constructor() {
    super('BILL_AMOUNT_BELOW_MIN', BILL_VALIDATION_MESSAGES.AMOUNT_MIN);
  }
}

