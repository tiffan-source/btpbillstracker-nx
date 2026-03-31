import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

export type AppFirebaseConfig = {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
};

export class FirebaseAppService {
    private static instance: FirebaseAppService;
    private readonly config: AppFirebaseConfig;

    constructor(config: AppFirebaseConfig) {
        this.config = config;
        FirebaseAppService.instance = this;
    }

    /**
     * Retourne l'instance singleton de Firebase App pour l'application.
     */
    private static getFirebaseApp(): FirebaseApp {
        return getApps().length > 0 ? getApp() : initializeApp(FirebaseAppService.instance.config);
    }

    /**
     * Retourne l'instance Firestore associée à l'application Firebase.
     */
    static getAppFirestore(): Firestore {
        return getFirestore(this.getFirebaseApp());
    }

    /**
     * Retourne l'instance Auth associée à l'application Firebase.
     */
    static getAppAuth(): Auth {
        return getAuth(this.getFirebaseApp());
    }
}
