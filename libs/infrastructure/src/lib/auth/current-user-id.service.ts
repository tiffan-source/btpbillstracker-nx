import { CurrentUserIdPort } from '@btpbilltracker/chore';

export class CurrentUserIdService extends CurrentUserIdPort {
  getRequiredUserId(): string {
    return "current-user-id"; // TODO: Implement actual logic to retrieve the current user ID
  }
}
