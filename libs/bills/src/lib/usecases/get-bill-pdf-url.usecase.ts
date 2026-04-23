import { AuthProvider, NoUserAuthenticatedError } from "@btpbilltracker/auth";
import { failure, Result, success } from "@btpbilltracker/chore";
import { DocumentRepository } from "../ports/document.repository";

export class GetBillPdfUrlUseCase {
  constructor(
    private readonly repository: DocumentRepository,
    private readonly currentUser: AuthProvider,
  ) {}

  async execute(documentId: string): Promise<Result<string>> {
    try {
      const owner = await this.currentUser.getCurrentUser();
      if (!owner) {
        throw new NoUserAuthenticatedError();
      }

      const documentUrl = await this.repository.getDocumentUrl(documentId);
      return success(documentUrl);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Une erreur inattendue est survenue";
      return failure("UNKNOWN_ERROR", message);
    }
  }
}