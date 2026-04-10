import { CurrentUserIdPort, failure, IdGeneratorPort, Result, success } from "@btpbilltracker/chore";
import { ChantierRepository } from "../ports/chantier.repository";
import { Chantier } from "../entities/chantier.entity";
import { ChantierNameAlreadyExistsError } from "../errors/chantier-name-already-exists.error";
import { InvalidChantierNameError } from "../errors/invalid-chantier-name.error";
import { ChantierPersistenceError } from "../errors/chantier-persistence.error";

export interface CreateChantierInput {
  name: string;
}

export class CreateChantierUseCase {
  constructor(
    private readonly repository: ChantierRepository,
    private readonly idGenerator: IdGeneratorPort,
    private readonly currentUserId: CurrentUserIdPort
  ) {}

  async execute(input: CreateChantierInput): Promise<Result<Chantier>> {
    try {
      const ownerUid = this.currentUserId.getRequiredUserId();
      const alreadyExists = await this.repository.existsByNameForUser(input.name, ownerUid);
      if (alreadyExists) {
        throw new ChantierNameAlreadyExistsError();
      }

      const chantier = new Chantier(this.idGenerator.generate(), input.name);
      await this.repository.save(chantier, ownerUid);
      return success(chantier);
    } catch (error: unknown) {
      if (
        error instanceof InvalidChantierNameError ||
        error instanceof ChantierNameAlreadyExistsError ||
        error instanceof ChantierPersistenceError
      ) {
        return failure(error.code, error.message, error.metadata);
      }

      const message = error instanceof Error ? error.message : 'Erreur inconnue sur la creation de chantier.';
      return failure('UNKNOWN_ERROR', message);
    }
  }
}
