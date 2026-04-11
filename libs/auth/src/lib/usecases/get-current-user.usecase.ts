import { AuthUser } from "../domains/auth-user";
import { AuthProvider } from "../ports/auth.provider";
import { failure, Result, success } from "@btpbilltracker/chore";

export class GetCurrentUserUseCase {

    constructor(
        private authProvider: AuthProvider,
    ) {}

  async execute(): Promise<Result<AuthUser | null>> {
    try {
        const user = await this.authProvider.getCurrentUser();
        return success(user);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
        return failure('UNKNOWN_ERROR', message);
    }
  }
} 