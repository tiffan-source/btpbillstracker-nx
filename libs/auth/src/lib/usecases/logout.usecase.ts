import { failure, Result, success } from "@btpbilltracker/chore";
import { AuthProvider } from "../ports/auth.provider";

export class LogoutUseCase {
    constructor(
        private authProvider: AuthProvider,
    ) {}

    async execute(): Promise<Result<void>> {
        try {
            await this.authProvider.logout();
            return success(undefined);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
            return failure('UNKNOWN_ERROR', message);
        }
    }
}