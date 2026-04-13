import { Chantier } from '../entities/chantier.entity';

export abstract class ChantierRepository {
  /**
   * Persister un chantier.
   * @throws {ChantierPersistenceError} Quand le stockage ne peut pas enregistrer le chantier.
   */
  abstract save(chantier: Chantier, ownerUid: string): Promise<void>;

  /**
   * Vérifier l'unicité du nom de chantier.
   * @throws {ChantierPersistenceError} Quand le stockage ne peut pas vérifier l'unicité.
   */
  abstract existsByNameForUser(name: string, ownerUid: string): Promise<boolean>;

  abstract getAllUserChantiers(userId: string): Promise<Chantier[]>;
}

