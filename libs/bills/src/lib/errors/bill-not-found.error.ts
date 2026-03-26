import { CoreError, CoreErrorMetadata } from '@btpbilltracker/chore';

export class BillNotFoundError extends CoreError {
  constructor(message = 'La facture à modifier est introuvable.', metadata?: CoreErrorMetadata) {
    super('BILL_NOT_FOUND', message, metadata);
  }
}
