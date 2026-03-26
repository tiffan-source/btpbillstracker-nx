import { CoreError, CoreErrorMetadata } from '@btpbilltracker/chore';

export class BillPersistenceError extends CoreError {
  constructor(message = 'Impossible de sauvegarder la facture.', metadata?: CoreErrorMetadata) {
    super('BILL_PERSISTENCE_ERROR', message, metadata);
  }
}

