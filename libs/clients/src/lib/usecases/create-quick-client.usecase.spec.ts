import { IdGeneratorPort } from '@btpbilltracker/chore';
import { Client } from '../entities/client.entity';
import { ClientPersistenceError } from '../errors/client-persistence.error';
import { ClientRepository } from '../ports/client.repository';
import { CreateQuickClientUseCase } from './create-quick-client.usecase';
import { AuthUser, AuthProvider } from '@btpbilltracker/auth';

class MockClientRepository implements ClientRepository {
  savedClient: Client[] = [];
  savedOwnerUid: string[] = [];
  throwUnknown = false;
  throwPersistenceError = false;

  async save(client: Client, ownerUid: string): Promise<void> {
    if (this.throwPersistenceError) {
      throw new ClientPersistenceError();
    }
    if (this.throwUnknown) {
      throw new Error('Unknown runtime issue');
    }
    this.savedClient.push(client);
    this.savedOwnerUid.push(ownerUid);
  }

    async getAllUserClients(userId: string): Promise<Client[]> {
        return this.savedClient;
    }
}

class StaticIdGenerator implements IdGeneratorPort {
  generate(): string {
    return 'client-id-123';
  }
}

class StaticCurrentUserId extends AuthProvider {
  async getCurrentUser(): Promise<AuthUser | null> {
    return new AuthUser('owner-uid-1', 'Owner 1');
  }

  async loginWithEmailAndPassword(email: string, password: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async registerWithEmailAndPassword(email: string, password: string): Promise<void> {
    throw new Error('Method not implemented.');
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

      expect(repository.savedClient).toContain(result.data);
      expect(repository.savedOwnerUid).toContain('owner-uid-1');
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
