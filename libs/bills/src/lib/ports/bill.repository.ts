import { Bill } from '../domains/bill.entity';

export abstract class BillRepository {
  /**
   * Persister une facture.
   * @throws {BillPersistenceError} Quand la persistance échoue.
   */
  abstract save(bill: Bill, ownerUid: string): Promise<void>;

  abstract edit(bill: Bill, ownerUid: string): Promise<void>;

  abstract findAllByOwner(ownerUid: string): Promise<Bill[]>;

  abstract findById(billId: string): Promise<Bill | null>;
}
