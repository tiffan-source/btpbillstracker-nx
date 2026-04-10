import { CurrentUserIdPort, IdGeneratorPort } from '@btpbilltracker/chore';
import { Client } from '../entities/client.entity';
import { ClientPersistenceError } from '../errors/client-persistence.error';
import { ClientRepository } from '../ports/client.repository';
import { CreateQuickClientUseCase } from './create-quick-client.usecase';

class MockClientRepository implements ClientRepository {
  savedClient: Client | null = null;
  savedOwnerUid: string | null = null;
  throwUnknown = false;
  throwPersistenceError = false;

  async save(client: Client, ownerUid: string): Promise<void> {
    if (this.throwPersistenceError) {
      throw new ClientPersistenceError();
    }
    if (this.throwUnknown) {
      throw new Error('Unknown runtime issue');
    }

    this.savedClient = client;
    this.savedOwnerUid = ownerUid;
  }
}

class StaticIdGenerator implements IdGeneratorPort {
  generate(): string {
    return 'client-id-123';
  }
}

class StaticCurrentUserId extends CurrentUserIdPort {
  getRequiredUserId(): string {
    return 'owner-uid-1';
  }
}

describe('CreateQuickClientUseCase', () => {
  it('should successfully create and save a new client with authenticated owner uid', async () => {
    const repository = new MockClientRepository();
    const useCase = new CreateQuickClientUseCase(
      repository,
      new StaticIdGenerator(),
      new StaticCurrentUserId(),
    );

    const result = await useCase.execute({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      phone: '+2290100000000',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe('Jane');
      expect(result.data.lastName).toBe('Doe');
      expect(result.data.email).toBe('jane@example.com');
      expect(result.data.phone).toBe('+2290100000000');
      expect(result.data.id).toBe('client-id-123');

      expect(repository.savedClient).toBe(result.data);
      expect(repository.savedOwnerUid).toBe('owner-uid-1');
    }
  });

  it('should return failure with specific code when name is empty', async () => {
    const repository = new MockClientRepository();
    const useCase = new CreateQuickClientUseCase(
      repository,
      new StaticIdGenerator(),
      new StaticCurrentUserId(),
    );

    const result = await useCase.execute({ firstName: '   ', lastName: 'Doe' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_CLIENT_NAME');
      expect(result.error.message).toContain('nom valide');
    }
  });

  it('should map known persistence error to its exact code', async () => {
    const repository = new MockClientRepository();
    repository.throwPersistenceError = true;
    const useCase = new CreateQuickClientUseCase(
      repository,
      new StaticIdGenerator(),
      new StaticCurrentUserId(),
    );

    const result = await useCase.execute({ firstName: 'Jane', lastName: 'Doe' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('CLIENT_PERSISTENCE_ERROR');
    }
  });

  it('should map unknown errors to UNKNOWN_ERROR', async () => {
    const repository = new MockClientRepository();
    repository.throwUnknown = true;
    const useCase = new CreateQuickClientUseCase(
      repository,
      new StaticIdGenerator(),
      new StaticCurrentUserId(),
    );

    const result = await useCase.execute({ firstName: 'Jane', lastName: 'Doe' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('UNKNOWN_ERROR');
    }
  });
});
