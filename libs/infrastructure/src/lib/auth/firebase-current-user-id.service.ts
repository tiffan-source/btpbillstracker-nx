import { CurrentUserIdPort } from '@btpbilltracker/chore';
import { FirebaseAppService } from '../repositories/firebase/firebase-app';

export class FirebaseCurrentUserIdService extends CurrentUserIdPort {
  getRequiredUserId(): string {
    const uid = FirebaseAppService.getAppAuth().currentUser?.uid;
    if (!uid) {
      throw new Error('Utilisateur Firebase non authentifié.');
    }

    return uid;
  }
}
