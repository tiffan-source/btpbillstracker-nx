import { AuthProvider, NoUserAuthenticatedError } from "@btpbilltracker/auth";
import { failure, Result, success } from "@btpbilltracker/chore";
import { DocumentRepository } from "../ports/document.repository";
import { BillRepository } from "../ports/bill.repository";
import { BillNotFoundError } from "../errors/bill-not-found.error";
import { BillWithoutDocumentError } from "../errors/bill-without-document.error";

export class GetBillPdfUrlUseCase {
  constructor(
    private readonly billRepository: BillRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly currentUser: AuthProvider,
  ) {}

  async execute(billId: string): Promise<Result<string>> {
    try {
        const owner = await this.currentUser.getCurrentUser();
        if (!owner) {
            throw new NoUserAuthenticatedError();
        }

        const bill = await this.billRepository.findById(billId);
        if (!bill) {
            throw new BillNotFoundError();
        }

        let documentId = bill.billDocumentId;
        if (documentId) {
            const documentUrl = await this.documentRepository.getDocumentUrl(documentId);
            return success(documentUrl);
        }

        throw new BillWithoutDocumentError();
    } catch (error: unknown) {
        if (
            error instanceof NoUserAuthenticatedError ||
            error instanceof BillNotFoundError ||
            error instanceof BillWithoutDocumentError
        ) {
            return failure(error.code, error.message, error.metadata);
        }

      const message = error instanceof Error ? error.message : "Une erreur inattendue est survenue";
      return failure("UNKNOWN_ERROR", message);
    }
  }
}