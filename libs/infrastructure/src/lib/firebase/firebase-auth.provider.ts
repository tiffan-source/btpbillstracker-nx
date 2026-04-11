import { AuthProvider, AuthUser } from "@btpbilltracker/auth"
import { FirebaseAppService } from "./firebase-app";
import { Auth } from "firebase/auth";

export class FirebaseAuthProvider implements AuthProvider {
    private readonly auth: Auth;

    public constructor(firebaseAppService: FirebaseAppService) {
        this.auth = FirebaseAppService.getAppAuth();
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
}