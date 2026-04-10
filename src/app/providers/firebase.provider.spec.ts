import { TestBed } from '@angular/core/testing';
import { CurrentUserIdPort } from '@btpbilltracker/chore';
import { AppFirebaseConfig, FirebaseAppService } from '@btpbilltracker/infrastructure';
import { FIREBASE_CONFIG } from '../../env/env';
import { FIREBASE_APP_CONFIG, provideFirebase } from './firebase.provider';

describe('provideFirebase', () => {
  it('wires FirebaseAppService with config from src/env by default', () => {
    TestBed.configureTestingModule({
      providers: [...provideFirebase()],
    });

    const configured = TestBed.inject(FIREBASE_APP_CONFIG);
    const service = TestBed.inject(FirebaseAppService);
    const currentUserPort = TestBed.inject(CurrentUserIdPort);

    expect(configured).toEqual(FIREBASE_CONFIG);
    expect(service).toBeTruthy();
    expect(currentUserPort).toBeTruthy();
  });

  it('supports dev/test config override input', () => {
    const testConfig: AppFirebaseConfig = {
      apiKey: 'test-api-key',
      authDomain: 'test-auth-domain',
      projectId: 'test-project',
      storageBucket: 'test-bucket',
      messagingSenderId: 'test-messaging-id',
      appId: 'test-app-id',
      measurementId: 'test-measure-id',
    };

    TestBed.configureTestingModule({
      providers: [...provideFirebase(testConfig)],
    });

    const configured = TestBed.inject(FIREBASE_APP_CONFIG);
    expect(configured).toEqual(testConfig);
  });
});
