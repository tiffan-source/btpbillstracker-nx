import { failure, IdGeneratorPort, Result, success } from '@btpbilltracker/chore';
import { Client } from '../entities/client.entity';
import { ClientPersistenceError } from '../errors/client-persistence.error';
import { InvalidClientNameError } from '../errors/invalid-client-name.error';
import { ClientRepository } from '../ports/client.repository';
import { AuthProvider, NoUserAuthenticatedError } from '@btpbilltracker/auth';

export interface CreateQuickClientInput {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

export class CreateQuickClientUseCase {
  constructor(
    private readonly repository: ClientRepository,
    private readonly idGenerator: IdGeneratorPort,
    private readonly currentUser: AuthProvider
  ) { }

  async execute(input: CreateQuickClientInput): Promise<Result<Client>> {
    try {
      const id = this.idGenerator.generate();
      const client = new Client(id, input.firstName)
        .setLastName(input.lastName)

      if (input.email) {
        client.setEmail(input.email);
      }
      if (input.phone) {
        client.setPhone(input.phone);
      }

      const owner = await this.currentUser.getCurrentUser();
      if (!owner) {
        throw new NoUserAuthenticatedError();
      }
      await this.repository.save(client, owner.uid);
      return success(client);
    } catch (error: unknown) {
      if (error instanceof InvalidClientNameError || error instanceof ClientPersistenceError) {
        return failure(error.code, error.message, error.metadata);
      }

      const message = error instanceof Error ? error.message : 'Error creating client';
      return failure('UNKNOWN_ERROR', message);
    }
  }
}
