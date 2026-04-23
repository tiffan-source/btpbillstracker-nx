import { AuthProvider, AuthUser } from "@btpbilltracker/auth";
import { Bill } from "../domains/bill.entity";
import { BillRepository } from "../ports/bill.repository";
import { EditBillUseCase } from "./edit-bill.usecase";

class InMemoryBillRepository implements BillRepository {
  private readonly bills = new Map<string, Bill>();
  editedBill: Bill | null = null;

  seedBill(bill: Bill): void {
    this.bills.set(bill.id, bill);
  }

  async save(): Promise<void> {
    return;
  }

  async edit(bill: Bill): Promise<void> {
    this.editedBill = bill;
    this.bills.set(bill.id, bill);
  }

  async findAllByOwner(): Promise<Bill[]> {
    return Array.from(this.bills.values());
  }

  async findById(billId: string): Promise<Bill | null> {
    return this.bills.get(billId) ?? null;
  }
}

class StaticCurrentUser implements AuthProvider {
  async getCurrentUser(): Promise<AuthUser | null> {
    return new AuthUser("owner-uid-1", "Owner 1");
  }
}

describe("EditBillUseCase", () => {
  it("replaces bill document relation when a new billDocumentId is provided on edit", async () => {
    const repository = new InMemoryBillRepository();
    const existingBill = new Bill("bill-1", "INV-1", "client-1", "chantier-1");
    existingBill.setBillDocumentId("pdf-previous");
    repository.seedBill(existingBill);

    const useCase = new EditBillUseCase(repository, new StaticCurrentUser());

    const result = await useCase.execute({
      billId: "bill-1",
      externalInvoiceReference: "INV-UPDATED",
      billDocumentId: "pdf-new",
    });

    expect(result.success).toBe(true);
    expect(repository.editedBill?.billDocumentId).toBe("pdf-new");
    expect((await repository.findById("bill-1"))?.billDocumentId).toBe("pdf-new");
  });
});
