import { Provider } from "@angular/core";
import { FirebaseAppService } from "libs/infrastructure/src/lib/repositories/firebase/firebase-app";
import { AppFirebaseConfig } from "libs/infrastructure/src/lib/repositories/firebase/firebase-app";

export const FIREBASE_PROVIDERS: Provider[] = [
    {provide: FirebaseAppService, useFactory:() => {
        const config: AppFirebaseConfig = {
            apiKey: "AIzaSyAQwDViS507UR4CNxUpNiKkEMcvGuWAwog",
            authDomain: "btprelance.firebaseapp.com",
            projectId: "btprelance",
            storageBucket: "btprelance.firebasestorage.app",
            messagingSenderId: "557005352195",
            appId: "1:557005352195:web:89e05e05d7901c94f20d36",
            measurementId: "G-B9PSDWZK3Y"
        };
        return new FirebaseAppService(config);
    }}
];