import { BillRepository } from "../ports/bill.repository";
import { failure, IdGeneratorPort, Result, success } from "@btpbilltracker/chore";
import { ReferenceGeneratorService } from "../ports/reference-generator.service";
import { Bill } from "../domains/bill.entity";
import { InvalidBillReferenceError } from "../errors/invalid-bill-reference.error";
import { BillAmountBelowMinError } from "../errors/bill-amount-below-min.error";
import { BillDueDateRequiredError } from "../errors/bill-due-date-required.error";
import { BillExternalReferenceRequiredError } from "../errors/bill-external-reference-required.error";
import { InvalidBillTypeError } from "../errors/invalid-bill-type.error";
import { InvalidPaymentModeError } from "../errors/invalid-payment-mode.error";
import { BillPersistenceError } from "../errors/bill-persistence.error";
import { ReminderScenarioRequiredError } from "../errors/reminder-scenario-required.error";

export type CreateEnrichedBillInput = {
  clientId: string;
  amountTTC: number;
  dueDate: string;
  externalInvoiceReference: string;
  type: string;
  paymentMode: string;
  chantierId: string;
  reminderScenarioId?: string;
};

/**
 * Crée une facture enrichie en validant les invariants métier du payload.
 */
export class CreateEnrichedBillUseCase {
  constructor(
    private readonly repository: BillRepository,
    private readonly referenceGenerator: ReferenceGeneratorService,
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  /**
   * Orchestrer la résolution client, la validation métier et la persistance de la facture.
   */
  async execute(input: CreateEnrichedBillInput): Promise<Result<Bill>> {
    try {
      const reference = await this.referenceGenerator.generate();

      const bill = new Bill(this.idGenerator.generate(), reference, input.clientId)
        .setAmountTTC(input.amountTTC)
        .setDueDate(input.dueDate)
        .setExternalInvoiceReference(input.externalInvoiceReference)
        .setType(input.type)
        .setPaymentMode(input.paymentMode)
        .setChantierId(input.chantierId)
        .configureReminder(input.reminderScenarioId);

      await this.repository.save(bill);
      return success(bill);
    } catch (error: unknown) {
      if (
        error instanceof InvalidBillReferenceError ||
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
