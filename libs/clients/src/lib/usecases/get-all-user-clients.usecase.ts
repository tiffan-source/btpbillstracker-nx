import { failure, Result, success } from "@btpbilltracker/chore";
import { Client } from "../entities/client.entity";
import { ClientRepository } from "../ports/client.repository";
import { AuthProvider, NoUserAuthenticatedError } from "@btpbilltracker/auth";

export class GetAllUserClientsUseCase {
    constructor(
        private readonly repository: ClientRepository,
        private readonly currentUser: AuthProvider
    ) {}

    async execute(): Promise<Result<Client[]>> {
        try {
            const owner = await this.currentUser.getCurrentUser();
            if (!owner) {
            throw new NoUserAuthenticatedError();
            }
            const clients = await this.repository.getAllUserClients(owner.uid);
            return success(clients);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error fetching clients';
            return failure('UNKNOWN_ERROR', message);
        }
    }
}