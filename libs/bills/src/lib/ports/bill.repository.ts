import { Bill } from '../domains/bill.entity';

export abstract class BillRepository {
  /**
   * Persister une facture.
   * @throws {BillPersistenceError} Quand la persistance échoue.
   */
  abstract save(bill: Bill): Promise<void>;


  /**
   * Mettre à jour une facture persistée.
   * @throws {BillNotFoundError} Quand la facture n'existe pas.
   * @throws {BillPersistenceError} Quand la persistance échoue.
   */
  abstract update(bill: Bill): Promise<void>;
}
