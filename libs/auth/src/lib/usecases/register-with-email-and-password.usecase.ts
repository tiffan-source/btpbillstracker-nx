import { failure, Result, success } from "@btpbilltracker/chore";
import { AuthProvider } from "../ports/auth.provider";
import { NotSamePasswordError } from "../errors/not-same-password.error";

export class RegisterWithEmailAndPasswordUseCase {
    constructor(
        private authProvider: AuthProvider
    ) {}

    async execute(email: string, password: string, confirmPassword: string): Promise<Result<void>> {
        try {
            if (password !== confirmPassword) {
                throw new NotSamePasswordError();
            }
            await this.authProvider.registerWithEmailAndPassword(email, password);
            return success(undefined);
        } catch (error) {
            if (error instanceof NotSamePasswordError) {
                return failure(error.code, error.message);
            }

            const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
            return failure('UNKNOWN_ERROR', message);
        }
    }
}