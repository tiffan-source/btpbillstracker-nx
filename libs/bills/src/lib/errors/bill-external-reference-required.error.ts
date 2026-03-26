import { BILL_VALIDATION_MESSAGES } from '../values/bill.constraints';
import { CoreError } from '@btpbilltracker/chore';

export class BillExternalReferenceRequiredError extends CoreError {
  constructor() {
    super('BILL_EXTERNAL_REFERENCE_REQUIRED', BILL_VALIDATION_MESSAGES.EXTERNAL_REFERENCE_REQUIRED);
  }
}

