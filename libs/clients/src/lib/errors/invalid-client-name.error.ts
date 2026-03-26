import { CoreError } from '@btpbilltracker/chore';

export class InvalidClientNameError extends CoreError {
  constructor() {
    super('INVALID_CLIENT_NAME', 'Un client doit avoir un nom valide.');
  }
}

