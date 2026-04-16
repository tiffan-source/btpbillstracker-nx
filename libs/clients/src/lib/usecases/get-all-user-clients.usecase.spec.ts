import { AuthProvider, AuthUser } from '@btpbilltracker/auth';
import { Client } from '../entities/client.entity';
import { ClientRepository } from '../ports/client.repository';
import { GetAllUserClientsUseCase } from './get-all-user-clients.usecase';

class MockClientRepository implements ClientRepository {
  clientsToReturn: Client[] = [];
  receivedUserId: string | null = null;
  throwError = false;
  throwNonError = false;

  async save(_client: Client, _ownerUid: string): Promise<void> {
    // Not used in this spec
  }

  async getAllUserClients(userId: string): Promise<Client[]> {
    this.receivedUserId = userId;

    if (this.throwError) {
      throw new Error('Database unavailable');
    }

    if (this.throwNonError) {
      throw 'non-error thrown';
    }

    return this.clientsToReturn;
  }
}

class AuthenticatedProvider extends AuthProvider {
  constructor(private readonly uid: string) {
    super();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return new AuthUser(this.uid, 'Test Owner');
  }

  async loginWithEmailAndPassword(_email: string, _password: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async registerWithEmailAndPassword(_email: string, _password: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

class UnauthenticatedProvider extends AuthProvider {
  async getCurrentUser(): Promise<AuthUser | null> {
    return null;
  }

  async loginWithEmailAndPassword(_email: string, _password: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async registerWithEmailAndPassword(_email: string, _password: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

describe('GetAllUserClientsUseCase', () => {
  it('should return success with clients for authenticated user', async () => {
    const repository = new MockClientRepository();
    repository.clientsToReturn = [
      { id: 'c1' } as Client,
      { id: 'c2' } as Client,
    ];

    const useCase = new GetAllUserClientsUseCase(
      repository,
      new AuthenticatedProvider('owner-uid-1'),
    );

    const result = await useCase.execute();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(repository.clientsToReturn);
      expect(repository.receivedUserId).toBe('owner-uid-1');
    }
  });

  it('should return success with empty list when user has no clients', async () => {
    const repository = new MockClientRepository();
    repository.clientsToReturn = [];

    const useCase = new GetAllUserClientsUseCase(
      repository,
      new AuthenticatedProvider('owner-uid-2'),
    );

    const result = await useCase.execute();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual([]);
      expect(repository.receivedUserId).toBe('owner-uid-2');
    }
  });

  it('should return failure NO_USER_AUTHENTICATED when no user is authenticated', async () => {
    const repository = new MockClientRepository();
    const useCase = new GetAllUserClientsUseCase(repository, new UnauthenticatedProvider());

    const result = await useCase.execute();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('NO_USER_AUTHENTICATED');
      expect(result.error.message).toBeTruthy();
    }
  });

  it('should map repository Error to UNKNOWN_ERROR with original message', async () => {
    const repository = new MockClientRepository();
    repository.throwError = true;

    const useCase = new GetAllUserClientsUseCase(
      repository,
      new AuthenticatedProvider('owner-uid-3'),
    );

    const result = await useCase.execute();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('UNKNOWN_ERROR');
      expect(result.error.message).toBe('Database unavailable');
    }
  });

  it('should map non-Error throws to UNKNOWN_ERROR with fallback message', async () => {
    const repository = new MockClientRepository();
    repository.throwNonError = true;

    const useCase = new GetAllUserClientsUseCase(
      repository,
      new AuthenticatedProvider('owner-uid-4'),
    );

    const result = await useCase.execute();

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('UNKNOWN_ERROR');
      expect(result.error.message).toBe('Error fetching clients');
    }
  });
});