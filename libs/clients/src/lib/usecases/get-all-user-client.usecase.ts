import { failure, Result, success } from "@btpbilltracker/chore";
import { Client } from "../entities/client.entity";
import { ClientRepository } from "../ports/client.repository";
import { AuthProvider } from "@btpbilltracker/auth";

export class GetAllUserClientsUseCase {
    constructor(
        private readonly repository: ClientRepository,
        private readonly currentUser: AuthProvider
    ) {}

    async execute(): Promise<Result<Client[]>> {
        try {
            const user = await this.currentUser.getCurrentUser();
            const clients = await this.repository.getAllUserClients(user?.uid || '');
            return success(clients);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error creating client';
            return failure('UNKNOWN_ERROR', message);
        }
    }
}