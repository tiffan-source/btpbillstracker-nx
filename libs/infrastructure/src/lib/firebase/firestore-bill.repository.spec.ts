import { Bill } from "@btpbilltracker/bills";
import { FirestoreBillRepository } from "./firestore-bill.repository";

describe("FirestoreBillRepository", () => {
  it("keeps the replaced billDocumentId when serializing and deserializing bills", () => {
    const repository = Object.create(FirestoreBillRepository.prototype) as FirestoreBillRepository;
    const bill = new Bill("bill-1", "INV-1", "client-1", "chantier-1");
    bill.setBillDocumentId("pdf-previous");
    bill.setBillDocumentId("pdf-new");

    const plain = (repository as any).toPlainBill(bill, "owner-1");
    const hydrated = (repository as any).toBillEntity(plain) as Bill | null;

    expect(plain.billDocumentId).toBe("pdf-new");
    expect(hydrated?.billDocumentId).toBe("pdf-new");
  });
});
