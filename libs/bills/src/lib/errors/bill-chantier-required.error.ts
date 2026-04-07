import { BILL_VALIDATION_MESSAGES } from '../values/bill.constraints';
import { CoreError } from '@btpbilltracker/chore';

export class BillChantierRequiredError extends CoreError {
  constructor() {
    super('BILL_CHANTIER_REQUIRED', BILL_VALIDATION_MESSAGES.CHANTIER_REQUIRED);
  }
}

