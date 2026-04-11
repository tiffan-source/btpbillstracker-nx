import { BillRepository } from "../ports/bill.repository";
import { CurrentUserIdPort, IdGeneratorPort, Result, runWithResult } from "@btpbilltracker/chore";
import { Bill } from "../domains/bill.entity";
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
    private readonly idGenerator: IdGeneratorPort,
    private readonly currentUserId: CurrentUserIdPort,
  ) {}

  /**
   * Orchestrer la résolution client, la validation métier et la persistance de la facture.
   */
  async execute(input: CreateEnrichedBillInput): Promise<Result<Bill>> {
    return runWithResult(
      async () => {
      const bill = new Bill(this.idGenerator.generate(), input.externalInvoiceReference, input.clientId, input.chantierId)
        .setAmountTTC(input.amountTTC)
        .setDueDate(input.dueDate)
        .setType(input.type)
        .setPaymentMode(input.paymentMode)

        if (input.reminderScenarioId) 
          bill.configureReminder(input.reminderScenarioId);

      const ownerUid = this.currentUserId.getRequiredUserId();
      await this.repository.save(bill, ownerUid);
      return bill;
      },
      [
        BillAmountBelowMinError,
        BillDueDateRequiredError,
        BillExternalReferenceRequiredError,
        InvalidBillTypeError,
        InvalidPaymentModeError,
        BillPersistenceError,
        ReminderScenarioRequiredError,
      ],
      'Une erreur inattendue est survenue',
    );
  }
}
