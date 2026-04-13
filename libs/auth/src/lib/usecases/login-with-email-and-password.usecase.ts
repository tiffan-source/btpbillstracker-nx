import { AuthProvider } from "../ports/auth.provider";
import { LoginWithEmailAndPasswordError } from "../errors/login-credidential-invalid.error";
import { failure, Result, success } from "@btpbilltracker/chore"

export class LoginWithEmailAndPasswordUseCase {

    constructor(
        private authProvider: AuthProvider,
    ) {}

    async execute(email: string, password: string): Promise<Result<void>> {
        try {
            await this.authProvider.loginWithEmailAndPassword(email, password)
            return success(undefined);
        } catch (error) {
            if (error instanceof LoginWithEmailAndPasswordError) 
                return failure(error.code, error.message);
            const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
            return failure('UNKNOWN_ERROR', message);
        }
    }
}