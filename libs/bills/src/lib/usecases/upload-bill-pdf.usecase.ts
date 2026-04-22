import { failure, IdGeneratorPort, Result, success } from "@btpbilltracker/chore";
import { AuthProvider, NoUserAuthenticatedError } from "@btpbilltracker/auth";
import { DocumentRepository } from "../ports/document.repository";
import { BillPersistenceError } from "../errors/bill-persistence.error";

export class UploadBillPdfUseCase {
  constructor(
    private readonly repository: DocumentRepository,
    private readonly idGenerator: IdGeneratorPort,
    private readonly currentUser: AuthProvider,
  ) {}

  async execute(pdfFile: File): Promise<Result<string>> {
    try {
        let idGenerator = this.idGenerator.generate();
      const owner = await this.currentUser.getCurrentUser();
      if (!owner) {
        throw new NoUserAuthenticatedError();
      }

      await this.repository.saveDocument(idGenerator, pdfFile, owner.uid);

      return success(idGenerator);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
      return failure('UNKNOWN_ERROR', message);
    }
  }
}