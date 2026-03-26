import { Client } from '../entities/client.entity';

export abstract class ClientRepository {
  /**
   * Persister un client.
   * @throws {ClientPersistenceError} Quand le stockage ne peut pas enregistrer le client.
   */
  abstract save(client: Client): Promise<void>;

  /**
   * Mettre à jour un client existant.
   * @throws {ClientPersistenceError} Quand le stockage ne peut pas mettre à jour le client.
   */
  abstract update(client: Client): Promise<void>;
}
