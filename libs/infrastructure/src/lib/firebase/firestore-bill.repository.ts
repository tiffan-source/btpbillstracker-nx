import { FirebaseAppService } from "./firebase-app";
import { Bill, BillRepository } from "@btpbilltracker/bills";
import { addDoc, doc, DocumentData, DocumentReference, getDocs, query, where } from "firebase/firestore";
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

    async findAllByOwner(ownerUid: string): Promise<Bill[]> {
        const q = query(this.getCollection(), where('ownerUid', '==', ownerUid));
        const querySnapshot = await getDocs(q);
        const bills: Bill[] = [];

        querySnapshot.forEach((doc) => {
          const plainBill = doc.data() as FirestorePlainBill;
          bills.push(this.toBillEntity(plainBill));
        });

        return bills;
    }

    private toBillEntity(plainBill: FirestorePlainBill): Bill {
        const bill = new Bill(plainBill.id, plainBill.externalInvoiceReference || '', plainBill.clientId, plainBill.chantierId || '')
            .setAmountTTC(plainBill.amountTTC || 0)
            .setDueDate(plainBill.dueDate || '')
            .setType(plainBill.type || '')
            .setPaymentMode(plainBill.paymentMode || '')
            .setStatus(plainBill.status as any)
            .configureReminder(plainBill.reminderScenarioId);
        return bill;
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
