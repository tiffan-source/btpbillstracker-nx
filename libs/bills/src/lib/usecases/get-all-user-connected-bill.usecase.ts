import { AuthProvider, NoUserAuthenticatedError } from "@btpbilltracker/auth";
import { BillRepository } from "../ports/bill.repository";
import { failure, Result, success } from "@btpbilltracker/chore";
import { Bill } from "../domains/bill.entity";
import { BillPersistenceError } from "../errors/bill-persistence.error";

export class GetAllUserConnectedBillsUseCase {
  constructor(
    private readonly repository: BillRepository,
    private readonly currentUser: AuthProvider,
  ) {}

  async execute(): Promise<Result<Bill[]>> {
    try {
      const owner = await this.currentUser.getCurrentUser();
      if (!owner) {
        throw new NoUserAuthenticatedError();
      }
      const bills = await this.repository.findAllByOwner(owner.uid);
      return success(bills);
    } catch (error: unknown) {
      if (error instanceof BillPersistenceError) {
        return failure(error.code, error.message, error.metadata);
      }

      const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
      return failure('UNKNOWN_ERROR', message);
    }
  }
}