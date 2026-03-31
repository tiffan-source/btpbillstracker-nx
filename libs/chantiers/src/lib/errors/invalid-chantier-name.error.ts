import { CoreError } from '@btpbilltracker/chore';

export class InvalidChantierNameError extends CoreError {
  constructor() {
    super('INVALID_CHANTIER_NAME', 'Un chantier doit avoir un nom valide.');
  }
}

