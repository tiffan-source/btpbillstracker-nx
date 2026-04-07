import { FirebaseAppService } from "./firebase-app";
import { BillPersistenceError, BillRepository } from "@btpbilltracker/bills"
import { Bill } from "@btpbilltracker/bills";
import { collection, CollectionReference, doc, DocumentData, DocumentReference, setDoc } from "firebase/firestore";

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

export class FirestoreBillRepository implements BillRepository {
  private readonly collectionName = 'bills';
    private readonly auth;
    private readonly store;

    public constructor(firebaseAppService: FirebaseAppService) {
        this.auth = FirebaseAppService.getAppAuth();
        this.store = FirebaseAppService.getAppFirestore();
    }

    private getCollection(): CollectionReference<DocumentData> {
        return collection(this.store, this.collectionName);
    }

    private getBillDocRef(billId: string): DocumentReference<DocumentData> {
        return doc(this.getCollection(), billId);
    }

    private async execute<T>(
        operation: (ownerUid: string) => Promise<T>,
        errorContext: { errorMessage?: string; context?: Record<string, unknown> }
    ): Promise<T> {
        try {
            const ownerUid = this.getOwnerUid();
            return await operation(ownerUid);
        } catch (error: unknown) {
            if (error instanceof BillPersistenceError) {
                throw error;
            }
            throw new BillPersistenceError(
                errorContext.errorMessage,
                { collection: this.collectionName, ...errorContext.context }
            );
        }
    }

    async save(bill: Bill): Promise<void> {
        return this.execute(async (ownerUid) => {
            await setDoc(this.getBillDocRef(bill.id), this.toPlainBill(bill, ownerUid));
        }, { context: { billId: bill.id } });
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

    private getOwnerUid(): string {
        const currentUser = this.auth.currentUser;
        if (!currentUser?.uid) {
            // throw new BillPersistenceError('Utilisateur non authentifié.', { collection: this.collectionName });
            return 'allUsers'; // Temporary fallback to allow unauthenticated access, should be handled properly in a real application
        }
        return currentUser.uid;
    }
}
