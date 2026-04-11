import { FirebaseAppService } from "./firebase-app";
import { Bill, BillRepository } from "@btpbilltracker/bills";
import { addDoc, doc, DocumentData, DocumentReference } from "firebase/firestore";
import { FirestoreBaseRepository } from "./firestore-base.repository";

export type FirestorePlainBill = {
  id: string;
  ownerUid: string;
  clientId: string;
  status: 'DRAFT' | 'VALIDATED' | 'PAID';
  amountTTC?: number;
  dueDate?: string;
  externalInvoiceReference?: string;
  type?: string;
  paymentMode?: string;
  chantierId?: string;
  reminderScenarioId: string;
};

export class FirestoreBillRepository extends FirestoreBaseRepository implements BillRepository {

    public constructor(firebaseAppService: FirebaseAppService) {
        super(firebaseAppService);
        this.collectionName = 'bills';
    }

    async save(bill: Bill, ownerUid: string): Promise<void> {
        await addDoc(this.getCollection(), this.toPlainBill(bill, ownerUid));
    }

    private toPlainBill(bill: Bill, ownerUid: string): FirestorePlainBill {
        return {
        id: bill.id,
        ownerUid,
        clientId: bill.clientId,
        status: bill.status,
        amountTTC: bill.amountTTC,
        dueDate: bill.dueDate,
        externalInvoiceReference: bill.externalInvoiceReference,
        type: bill.type,
        paymentMode: bill.paymentMode,
        chantierId: bill.chantierId,
        reminderScenarioId: bill.reminderScenarioId || ""
        };
    }
}
