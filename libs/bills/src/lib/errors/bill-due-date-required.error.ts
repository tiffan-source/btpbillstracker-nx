import { BILL_VALIDATION_MESSAGES } from '../values/bill.constraints';
import { CoreError } from '@btpbilltracker/chore';

export class BillDueDateRequiredError extends CoreError {
  constructor() {
    super('BILL_DUE_DATE_REQUIRED', BILL_VALIDATION_MESSAGES.DUE_DATE_REQUIRED);
  }
}

