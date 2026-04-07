import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { CLIENT_PROVIDERS } from './providers/clients.provider';
import { CHANTIER_PROVIDERS } from './providers/chantiers.provider';
import { FIREBASE_PROVIDERS } from './providers/firebase.provider';
import { BILL_PROVIDERS } from './providers/bills.provider';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    ...FIREBASE_PROVIDERS,
    ...CLIENT_PROVIDERS,
    ...CHANTIER_PROVIDERS,
    ...BILL_PROVIDERS,
    MessageService
],
}
