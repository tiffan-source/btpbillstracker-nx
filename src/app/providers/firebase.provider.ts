import { InjectionToken, Provider } from '@angular/core';
import { CurrentUserIdPort } from '@btpbilltracker/chore';
import { AppFirebaseConfig, FirebaseAppService, CurrentUserIdService } from '@btpbilltracker/infrastructure';
import { FIREBASE_CONFIG } from '../../env/env';

export const FIREBASE_APP_CONFIG = new InjectionToken<AppFirebaseConfig>('FIREBASE_APP_CONFIG');

export function provideFirebase(config: AppFirebaseConfig = FIREBASE_CONFIG): Provider[] {
  return [
    { provide: FIREBASE_APP_CONFIG, useValue: config },
    {
      provide: FirebaseAppService,
      useFactory: (firebaseConfig: AppFirebaseConfig) => new FirebaseAppService(firebaseConfig),
      deps: [FIREBASE_APP_CONFIG],
    },
    { provide: CurrentUserIdPort, useClass: CurrentUserIdService },
  ];
}

export const FIREBASE_PROVIDERS: Provider[] = provideFirebase();
