import { AuthProvider, NoUserAuthenticatedError } from "@btpbilltracker/auth";
import { ChantierRepository } from "../ports/chantier.repository";
import { failure, Result, success } from "@btpbilltracker/chore";
import { Chantier } from "../entities/chantier.entity";

export class GetAllUserChantiersUseCase {
  constructor(
    private readonly repository: ChantierRepository,
    private readonly currentUser: AuthProvider
  ) {}

    async execute(): Promise<Result<Chantier[]>> {
        try {
            const owner = await this.currentUser.getCurrentUser();
            if (!owner) {
                throw new NoUserAuthenticatedError();
            }
            const chantiers = await this.repository.getAllUserChantiers(owner.uid);
            return success(chantiers);
        } catch (error) {
            if (error instanceof NoUserAuthenticatedError) {
                return failure(error.code, error.message, error.metadata);
            }
            const message = error instanceof Error ? error.message : 'Error fetching chantiers';
            return failure('UNKNOWN_ERROR', message);
        }
    }
}