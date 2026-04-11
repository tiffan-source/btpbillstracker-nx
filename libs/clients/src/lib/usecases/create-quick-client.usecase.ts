import { CurrentUserIdPort, IdGeneratorPort, Result, runWithResult } from '@btpbilltracker/chore';
import { Client } from '../entities/client.entity';
import { ClientPersistenceError } from '../errors/client-persistence.error';
import { InvalidClientNameError } from '../errors/invalid-client-name.error';
import { ClientRepository } from '../ports/client.repository';

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
    private readonly currentUserId: CurrentUserIdPort
  ) { }

  async execute(input: CreateQuickClientInput): Promise<Result<Client>> {
    return runWithResult(
      async () => {
      const id = this.idGenerator.generate();
      const client = new Client(id, input.firstName)
        .setLastName(input.lastName)

      if (input.email) {
        client.setEmail(input.email);
      }
      if (input.phone) {
        client.setPhone(input.phone);
      }

      const ownerUid = this.currentUserId.getRequiredUserId();
      await this.repository.save(client, ownerUid);
      return client;
      },
      [InvalidClientNameError, ClientPersistenceError],
      'Error creating client',
    );
  }
}
