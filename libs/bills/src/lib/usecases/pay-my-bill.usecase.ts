import { AuthProvider, NoUserAuthenticatedError } from "@btpbilltracker/auth";
import { BillRepository } from "../ports/bill.repository";
import { BillNotFoundError } from "../errors/bill-not-found.error";
import { Bill, BILL_STATUS } from "../domains/bill.entity";
import { failure, Result, success } from "@btpbilltracker/chore";

export class PayMyBillUseCase {
  constructor(
    private readonly repository: BillRepository,
    private readonly currentUser: AuthProvider,
  ) { }

  async execute(billId: string, paymentDetails: any): Promise<Result<Bill>> {
    try {
        const owner = await this.currentUser.getCurrentUser();
        if (!owner) {
            throw new NoUserAuthenticatedError();
        }

        const bill = await this.repository.findById(billId);
        if (!bill) {
            throw new BillNotFoundError(billId);
        }

        bill.setStatus(BILL_STATUS.PAID);

        await this.repository.edit(bill, owner.uid);

        return success(bill);
    } catch (error: unknown) {
      if (
        error instanceof NoUserAuthenticatedError ||
        error instanceof BillNotFoundError
      ) {
        return failure(error.code, error.message, error.metadata);
      }

      const message = error instanceof Error ? error.message : 'Erreur inconnue sur la creation de chantier.';
      return failure('UNKNOWN_ERROR', message);
    }
  }
}