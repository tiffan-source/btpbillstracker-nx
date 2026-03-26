import { CoreError } from '@btpbilltracker/chore';

export class ReminderScenarioRequiredError extends CoreError {
  constructor(message = 'Un scénario de relance est requis lorsque les relances automatiques sont activées.') {
    super('REMINDER_SCENARIO_REQUIRED', message);
  }
}
