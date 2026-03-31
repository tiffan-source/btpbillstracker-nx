import { CoreError, CoreErrorMetadata } from '@btpbilltracker/chore';

export class ChantierPersistenceError extends CoreError {
  constructor(message = 'Impossible de sauvegarder le chantier.', metadata?: CoreErrorMetadata) {
    super('CHANTIER_PERSISTENCE_ERROR', message, metadata);
  }
}

