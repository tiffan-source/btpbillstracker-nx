import { AuthProvider, AuthUser } from "@btpbilltracker/auth";
import { DocumentRepository } from "../ports/document.repository";
import { GetBillPdfUrlUseCase } from "./get-bill-pdf-url.usecase";

class InMemoryDocumentRepository implements DocumentRepository {
  urlToReturn = "https://cdn.test/bill.pdf";
  errorToThrow: unknown;
  requestedDocumentId: string | null = null;

  async saveDocument(): Promise<void> {
    return;
  }

  async deleteDocument(): Promise<void> {
    return;
  }

  async getDocumentUrl(documentId: string): Promise<string> {
    this.requestedDocumentId = documentId;

    if (this.errorToThrow) {
      throw this.errorToThrow;
    }

    return this.urlToReturn;
  }
}

class StaticCurrentUser implements AuthProvider {
  constructor(private readonly user: AuthUser | null, private readonly errorToThrow?: unknown) {}

  async getCurrentUser(): Promise<AuthUser | null> {
    if (this.errorToThrow) {
      throw this.errorToThrow;
    }

    return this.user;
  }

  async loginWithEmailAndPassword(): Promise<void> {
    return;
  }

  async registerWithEmailAndPassword(): Promise<void> {
    return;
  }

  async logout(): Promise<void> {
    return;
  }
}

describe("GetBillPdfUrlUseCase", () => {
  it("returns a public URL when user is authenticated", async () => {
    const repository = new InMemoryDocumentRepository();
    const useCase = new GetBillPdfUrlUseCase(
      repository,
      new StaticCurrentUser(new AuthUser("owner-uid-1", "owner@btp.com")),
    );

    const result = await useCase.execute("pdf-1");

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data).toBe("https://cdn.test/bill.pdf");
    expect(repository.requestedDocumentId).toBe("pdf-1");
  });

  it("fails when no user is authenticated", async () => {
    const repository = new InMemoryDocumentRepository();
    const useCase = new GetBillPdfUrlUseCase(repository, new StaticCurrentUser(null));

    const result = await useCase.execute("pdf-2");

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.code).toBe("UNKNOWN_ERROR");
    expect(result.error.message).toBe("No user is currently authenticated");
    expect(repository.requestedDocumentId).toBeNull();
  });

  it("fails with UNKNOWN_ERROR when repository throws", async () => {
    const repository = new InMemoryDocumentRepository();
    repository.errorToThrow = new Error("Storage unavailable");

    const useCase = new GetBillPdfUrlUseCase(
      repository,
      new StaticCurrentUser(new AuthUser("owner-uid-1", "owner@btp.com")),
    );

    const result = await useCase.execute("pdf-3");

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.code).toBe("UNKNOWN_ERROR");
    expect(result.error.message).toBe("Storage unavailable");
    expect(repository.requestedDocumentId).toBe("pdf-3");
  });
});