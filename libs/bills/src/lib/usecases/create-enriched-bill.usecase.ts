import { BillRepository } from "../ports/bill.repository";
import { failure, IdGeneratorPort, Result, success } from "@btpbilltracker/chore";
import { Bill } from "../domains/bill.entity";
import { BillAmountBelowMinError } from "../errors/bill-amount-below-min.error";
import { BillDueDateRequiredError } from "../errors/bill-due-date-required.error";
import { BillExternalReferenceRequiredError } from "../errors/bill-external-reference-required.error";
import { InvalidBillTypeError } from "../errors/invalid-bill-type.error";
import { InvalidPaymentModeError } from "../errors/invalid-payment-mode.error";
import { BillPersistenceError } from "../errors/bill-persistence.error";
import { ReminderScenarioRequiredError } from "../errors/reminder-scenario-required.error";
import { AuthProvider, NoUserAuthenticatedError } from "@btpbilltracker/auth";

export type CreateEnrichedBillInput = {
  clientId: string;
  amountTTC: number;
  dueDate: string;
  externalInvoiceReference: string;
  type: string;
  paymentMode: string;
  chantierId: string;
  reminderScenarioId?: string;
  billDocumentId?: string;
};

/**
 * Crée une facture enrichie en validant les invariants métier du payload.
 */
export class CreateEnrichedBillUseCase {
  constructor(
    private readonly repository: BillRepository,
    private readonly idGenerator: IdGeneratorPort,
    private readonly currentUser: AuthProvider,
  ) {}

  /**
   * Orchestrer la résolution client, la validation métier et la persistance de la facture.
   */
  async execute(input: CreateEnrichedBillInput): Promise<Result<Bill>> {
    try {

      const bill = new Bill(this.idGenerator.generate(), input.externalInvoiceReference, input.clientId, input.chantierId)
        .setAmountTTC(input.amountTTC)
        .setDueDate(input.dueDate)
        .setType(input.type)
        .setPaymentMode(input.paymentMode)

         if (input.billDocumentId) {
            bill.setBillDocumentId(input.billDocumentId);
        }

        if (input.reminderScenarioId) 
          bill.configureReminder(input.reminderScenarioId);

      const owner = await this.currentUser.getCurrentUser();
      if (!owner) {
        throw new NoUserAuthenticatedError();
      }
      await this.repository.save(bill, owner.uid );
      return success(bill);
    } catch (error: unknown) {
      if (
        error instanceof BillAmountBelowMinError ||
        error instanceof BillDueDateRequiredError ||
        error instanceof BillExternalReferenceRequiredError ||
        error instanceof InvalidBillTypeError ||
        error instanceof InvalidPaymentModeError ||
        error instanceof BillPersistenceError ||
        error instanceof ReminderScenarioRequiredError
      ) {
        return failure(error.code, error.message, error.metadata);
      }

      const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
      return failure('UNKNOWN_ERROR', message);
    }
  }
}
