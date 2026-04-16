import { AuthProvider, AuthUser } from '@btpbilltracker/auth';
import { Bill } from '../domains/bill.entity';
import { BillPersistenceError } from '../errors/bill-persistence.error';
import { BillRepository } from '../ports/bill.repository';
import { GetAllUserConnectedBillsUseCase } from './get-all-user-connected-bill.usecase';

class InMemoryBillRepository implements BillRepository {
  ownerUidQueried: string | null = null;
  billsToReturn: Bill[] = [];
  errorToThrow: unknown;

  async save(): Promise<void> {
    return;
  }

  async findAllByOwner(ownerUid: string): Promise<Bill[]> {
    this.ownerUidQueried = ownerUid;

    if (this.errorToThrow) {
      throw this.errorToThrow;
    }

    return this.billsToReturn;
  }
}

class StaticCurrentUser implements AuthProvider {
  constructor(private readonly user: AuthUser | null, private readonly errorToThrow?: unknown) {}

  async getCurrentUser(): Promise<AuthUser | null> {
    if (this.errorToThrow) {
      throw this.errorToThrow;
    }

    return this.user;
  }

  async loginWithEmailAndPassword(): Promise<void> {
    return;
  }

  async registerWithEmailAndPassword(): Promise<void> {
    return;
  }
}

describe('GetAllUserConnectedBillsUseCase', () => {
  it('returns all bills owned by the authenticated user', async () => {
    const repository = new InMemoryBillRepository();
    repository.billsToReturn = [
      new Bill('bill-1', 'EXT-001', 'client-1', 'chantier-1'),
      new Bill('bill-2', 'EXT-002', 'client-2', 'chantier-2'),
    ];
    const useCase = new GetAllUserConnectedBillsUseCase(
      repository,
      new StaticCurrentUser(new AuthUser('owner-uid-1', 'owner@btp.com')),
    );

    const result = await useCase.execute();

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data).toHaveLength(2);
    expect(result.data[0].id).toBe('bill-1');
    expect(result.data[1].id).toBe('bill-2');
    expect(repository.ownerUidQueried).toBe('owner-uid-1');
  });

  it('fails when no user is authenticated', async () => {
    const repository = new InMemoryBillRepository();
    const useCase = new GetAllUserConnectedBillsUseCase(repository, new StaticCurrentUser(null));

    const result = await useCase.execute();

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.code).toBe('UNKNOWN_ERROR');
    expect(result.error.message).toBe('No user is currently authenticated');
    expect(repository.ownerUidQueried).toBeNull();
  });

  it('fails with persistence error details when repository throws BillPersistenceError', async () => {
    const repository = new InMemoryBillRepository();
    repository.errorToThrow = new BillPersistenceError('Impossible de charger les factures.', {
      operation: 'findAllByOwner',
      ownerUid: 'owner-uid-1',
    });
    const useCase = new GetAllUserConnectedBillsUseCase(
      repository,
      new StaticCurrentUser(new AuthUser('owner-uid-1', 'owner@btp.com')),
    );

    const result = await useCase.execute();

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.code).toBe('BILL_PERSISTENCE_ERROR');
    expect(result.error.message).toBe('Impossible de charger les factures.');
    expect(result.error.metadata).toEqual({
      operation: 'findAllByOwner',
      ownerUid: 'owner-uid-1',
    });
  });

  it('fails with UNKNOWN_ERROR when an unexpected error occurs', async () => {
    const repository = new InMemoryBillRepository();
    repository.errorToThrow = new Error('Database unavailable');
    const useCase = new GetAllUserConnectedBillsUseCase(
      repository,
      new StaticCurrentUser(new AuthUser('owner-uid-1', 'owner@btp.com')),
    );

    const result = await useCase.execute();

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.code).toBe('UNKNOWN_ERROR');
    expect(result.error.message).toBe('Database unavailable');
  });
});