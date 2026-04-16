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
          const bill = this.toBillEntity(plainBill);

          if (bill !== null) {
            bills.push(bill);
          }
        });

        return bills;
    }

    private toBillEntity(plainBill: FirestorePlainBill): Bill | null {        
        if (
            !this.isNonEmptyString(plainBill.id) ||
            !this.isNonEmptyString(plainBill.clientId) ||
            !this.isNonEmptyString(plainBill.externalInvoiceReference) ||
            !this.isNonEmptyString(plainBill.chantierId)
        ) {
            return null;
        }

        const bill = new Bill(
            plainBill.id,
            plainBill.externalInvoiceReference,
            plainBill.clientId,
            plainBill.chantierId
        );

        console.log(plainBill.amountTTC);
        
        bill.setAmountTTC(parseInt(plainBill.amountTTC?.toString() || "0"));

        if (this.isNonEmptyString(plainBill.dueDate)) {
            bill.setDueDate(plainBill.dueDate);
        }

        if (this.isNonEmptyString(plainBill.type)) {
            try {
                bill.setType(plainBill.type);
            } catch {
                // Ignore invalid legacy Firestore values for optional fields.
            }
        }

        if (this.isNonEmptyString(plainBill.paymentMode)) {
            try {
                bill.setPaymentMode(plainBill.paymentMode);
            } catch {
                // Ignore invalid legacy Firestore values for optional fields.
            }
        }

        if (plainBill.status === 'DRAFT' || plainBill.status === 'VALIDATED' || plainBill.status === 'PAID') {
            bill.setStatus(plainBill.status as any);
        }

        if (this.isNonEmptyString(plainBill.reminderScenarioId)) {
            bill.configureReminder(plainBill.reminderScenarioId);
        }

        return bill;
    }

    private isNonEmptyString(value: unknown): value is string {
        return typeof value === 'string' && value.trim().length > 0;
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
