import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { AppFirebaseConfig } from '@btpbilltracker/infrastructure';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { CLIENT_PROVIDERS } from './providers/clients.provider';
import { CHANTIER_PROVIDERS } from './providers/chantiers.provider';
import { provideFirebase } from './providers/firebase.provider';
import { BILL_PROVIDERS } from './providers/bills.provider';
import { MessageService } from 'primeng/api';
import { FIREBASE_CONFIG } from '../env/env';
import { AUTH_PROVIDERS } from './providers/auth.provider';
import { REMINDER_PROVIDERS } from './providers/reminder.provider';

export function provideAppConfig(config: AppFirebaseConfig = FIREBASE_CONFIG): ApplicationConfig {
  return {
    providers: [
      provideBrowserGlobalErrorListeners(),
      provideRouter(appRoutes),
      providePrimeNG({
        theme: {
          preset: Aura,
        },
      }),
      ...provideFirebase(config),
      ...CLIENT_PROVIDERS,
      ...CHANTIER_PROVIDERS,
      ...BILL_PROVIDERS,
      ...AUTH_PROVIDERS,
      ...REMINDER_PROVIDERS,
      MessageService,
    ],
  };
}

export const appConfig: ApplicationConfig = provideAppConfig();
