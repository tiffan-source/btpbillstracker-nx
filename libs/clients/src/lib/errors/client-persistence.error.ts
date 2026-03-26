import { CoreError, CoreErrorMetadata } from '@btpbilltracker/chore';

export class ClientPersistenceError extends CoreError {
  constructor(message = 'Impossible de sauvegarder le client.', metadata?: CoreErrorMetadata) {
    super('CLIENT_PERSISTENCE_ERROR', message, metadata);
  }
}

