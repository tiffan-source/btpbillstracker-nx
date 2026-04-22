import { AuthProvider, AuthUser, EmailAlreadyUseError, LoginWithEmailAndPasswordError } from "@btpbilltracker/auth"
import { FirebaseAppService } from "./firebase-app";
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { FirebaseError } from "firebase/app";

export class FirebaseAuthProvider implements AuthProvider {
    private readonly auth: Auth;

    public constructor(firebaseAppService: FirebaseAppService) {
        this.auth = FirebaseAppService.getAppAuth();
    }

    async logout(): Promise<void> {
        await signOut(this.auth);
    }
    
    async getCurrentUser() {
        await this.auth.authStateReady();
        let user = this.auth.currentUser;
        if (!user) {
            return null;
        }

        let currentUser: AuthUser = new AuthUser(user.uid, user.email || "")
        currentUser.setEmailVerified(user.emailVerified);
        currentUser.setDisplayName(user.displayName || "");
        
        return currentUser;
    }

    async loginWithEmailAndPassword(email: string, password: string): Promise<void> {
        try {
            await signInWithEmailAndPassword(this.auth, email, password);        
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === "auth/invalid-credential")
                    throw new LoginWithEmailAndPasswordError()
            }
            
        }
    }

    async registerWithEmailAndPassword(email: string, password: string): Promise<void> {
        try {
            await createUserWithEmailAndPassword(this.auth, email, password);
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === "auth/email-already-in-use")
                    throw new EmailAlreadyUseError(email)
            }
        }
    }
}