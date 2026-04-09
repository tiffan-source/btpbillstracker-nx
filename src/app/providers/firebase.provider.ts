import { Provider } from "@angular/core";
import { FirebaseAppService } from "libs/infrastructure/src/lib/repositories/firebase/firebase-app";
import { AppFirebaseConfig } from "libs/infrastructure/src/lib/repositories/firebase/firebase-app";
import { FIREBASE_CONFIG } from "src/env/env";

export const FIREBASE_PROVIDERS: Provider[] = [
    {provide: FirebaseAppService, useFactory:() => {
        const config: AppFirebaseConfig = FIREBASE_CONFIG;
        return new FirebaseAppService(config);
    }}
];