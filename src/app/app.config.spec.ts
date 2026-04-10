import { TestBed } from '@angular/core/testing';
import { AppFirebaseConfig, FirebaseAppService } from '@btpbilltracker/infrastructure';
import { FIREBASE_CONFIG } from '../env/env';
import { FIREBASE_CONFIG as FIREBASE_DEV_CONFIG } from '../env/env.dev';
import { provideAppConfig } from './app.config';
import { FIREBASE_APP_CONFIG } from './providers/firebase.provider';
import { CreateBillsOrchestrator } from './services/create-bills/orchestrator/create-bills.orchestrator';

describe('provideAppConfig', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  it('wires bootstrap and create-bill runtime through centralized Firebase providers by default', () => {
    const config = provideAppConfig();

    TestBed.configureTestingModule({
      providers: config.providers,
    });

    const configured = TestBed.inject(FIREBASE_APP_CONFIG);
    const appService = TestBed.inject(FirebaseAppService);
    const orchestrator = TestBed.inject(CreateBillsOrchestrator);

    expect(configured).toEqual(FIREBASE_CONFIG);
    expect(appService).toBeTruthy();
    expect(orchestrator).toBeTruthy();
  });

  it('supports dev/test Firebase config input at bootstrap time', () => {
    const devConfig: AppFirebaseConfig = FIREBASE_DEV_CONFIG;
    const config = provideAppConfig(devConfig);

    TestBed.configureTestingModule({
      providers: config.providers,
    });

    const configured = TestBed.inject(FIREBASE_APP_CONFIG);
    expect(configured).toEqual(devConfig);
  });
});
