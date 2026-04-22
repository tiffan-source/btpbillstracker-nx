import { InjectionToken, Provider } from '@angular/core';
import { AppFirebaseConfig, FirebaseAppService } from '@btpbilltracker/infrastructure';

export const FIREBASE_APP_CONFIG = new InjectionToken<AppFirebaseConfig>('FIREBASE_APP_CONFIG');

export function provideFirebase(config: AppFirebaseConfig): Provider[] {
  return [
    { provide: FIREBASE_APP_CONFIG, useValue: config },
    {
      provide: FirebaseAppService,
      useFactory: (firebaseConfig: AppFirebaseConfig) => new FirebaseAppService(firebaseConfig),
      deps: [FIREBASE_APP_CONFIG],
    },
  ];
}
