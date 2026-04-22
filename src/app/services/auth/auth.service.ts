import { inject, Injectable, signal } from "@angular/core";
import { GetCurrentUserUseCase, LoginWithEmailAndPasswordUseCase, LogoutUseCase, RegisterWithEmailAndPasswordUseCase } from "@btpbilltracker/auth";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private getCurrentUserUseCase = inject(GetCurrentUserUseCase)
    private loginWithEmailAndPasswordUseCase = inject(LoginWithEmailAndPasswordUseCase)
    private registerWithEmailAndPasswordUseCase = inject(RegisterWithEmailAndPasswordUseCase)
    private logoutUseCase = inject(LogoutUseCase)

    private router = inject(Router)
    isProcessing = signal(false);
    processError = signal<string | null>(null);

    async logout(): Promise<void> {
        await this.logoutUseCase.execute();
        this.router.navigate(['/login']);
    }

    async isSignedIn(): Promise<boolean> {
        const result = await this.getCurrentUserUseCase.execute();
        if (result.success && result.data) {
            return true;
        }
        return false;
    }

    async loginWithEmailAndPassword(email: string, password: string): Promise<void> {
        this.isProcessing.set(true);
        this.processError.set(null);
        try {
            let result = await this.loginWithEmailAndPasswordUseCase.execute(email, password);
            this.isProcessing.set(false);

            if(result.success)
                this.router.navigate(['/']);
            else
                this.processError.set(result.error.message);
        } catch (error) {
            this.processError.set("Login failed. Please check your credentials.");
            this.isProcessing.set(false);
        }
    }

    async registerWithEmailAndPassword(email: string, password: string, confirmPassword: string): Promise<void> {
        this.isProcessing.set(true);
        this.processError.set(null);
        try {
            let result = await this.registerWithEmailAndPasswordUseCase.execute(email, password, confirmPassword);
            this.isProcessing.set(false);
            
            if(result.success)
                this.router.navigate(['/']);
            else
                this.processError.set(result.error.message);
        } catch (error) {
            this.processError.set("Registration failed. Please check your input.");
            this.isProcessing.set(false);
        }
    }
}