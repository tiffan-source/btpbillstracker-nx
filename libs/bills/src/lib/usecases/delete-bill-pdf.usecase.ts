import { failure, Result, success } from "@btpbilltracker/chore";
import { DocumentRepository } from "../ports/document.repository";
import { AuthProvider, NoUserAuthenticatedError } from "@btpbilltracker/auth";

export class DeleteBillPdfUseCase {
    constructor(
        private readonly repository: DocumentRepository,
        private readonly currentUser: AuthProvider,
    ) {}

    async execute(documentId: string): Promise<Result<undefined>> {
        try {
            const owner = await this.currentUser.getCurrentUser();
            if (!owner) {
                throw new NoUserAuthenticatedError();
            }

            await this.repository.deleteDocument(documentId);

            return success(undefined);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
            return failure('UNKNOWN_ERROR', message);
        }
    }
}