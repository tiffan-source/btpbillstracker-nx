export abstract class DocumentRepository {
  /**
   * Persister un document lié à une facture.
   * @throws {BillPersistenceError} Quand la persistance échoue.
   */
  abstract saveDocument(documentId: string, file: File, ownerUid: string): Promise<void> ;
}