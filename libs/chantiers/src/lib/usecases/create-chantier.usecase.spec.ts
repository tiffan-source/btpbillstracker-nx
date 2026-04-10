import { CurrentUserIdPort, IdGeneratorPort } from '@btpbilltracker/chore';
import { Chantier } from '../entities/chantier.entity';
import { ChantierRepository } from '../ports/chantier.repository';
import { CreateChantierUseCase } from './create-chantier.usecase';

class InMemoryChantierRepository extends ChantierRepository {
  readonly chantiers: Array<{ chantier: Chantier; ownerUid: string }> = [];

  async save(chantier: Chantier, ownerUid: string): Promise<void> {
    this.chantiers.push({ chantier, ownerUid });
  }

  async existsByNameForUser(name: string, ownerUid: string): Promise<boolean> {
    const normalizedName = name.trim().toLowerCase();
    return this.chantiers.some(
      ({ chantier, ownerUid: currentOwnerUid }) =>
        currentOwnerUid === ownerUid && chantier.name.trim().toLowerCase() === normalizedName,
    );
  }
}

class StaticIdGenerator implements IdGeneratorPort {
  generate(): string {
    return 'chantier-id-123';
  }
}

class StaticCurrentUserId extends CurrentUserIdPort {
  getRequiredUserId(): string {
    return 'owner-uid-1';
  }
}

describe('CreateChantierUseCase', () => {
  it('creates chantier with unique name for the authenticated user', async () => {
    const repository = new InMemoryChantierRepository();
    const useCase = new CreateChantierUseCase(
      repository,
      new StaticIdGenerator(),
      new StaticCurrentUserId(),
    );

    const result = await useCase.execute({ name: 'Villa A' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Villa A');
      expect(result.data.id).toBe('chantier-id-123');
      expect(repository.chantiers[0]?.ownerUid).toBe('owner-uid-1');
    }
  });

  it('fails when chantier name already exists for the authenticated user', async () => {
    const repository = new InMemoryChantierRepository();
    await repository.save(new Chantier('ch-1', 'Villa A'), 'owner-uid-1');
    const useCase = new CreateChantierUseCase(
      repository,
      new StaticIdGenerator(),
      new StaticCurrentUserId(),
    );

    const result = await useCase.execute({ name: 'vIlLa a' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('CHANTIER_NAME_ALREADY_EXISTS');
    }
  });
});
