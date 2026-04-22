import { failure, Result, success } from "@btpbilltracker/chore";
import { BillRepository } from "../ports/bill.repository";
import { AuthProvider } from "libs/auth/src/lib/ports/auth.provider";
import { Bill } from "../domains/bill.entity";
import { BillNotFoundError } from "../errors/bill-not-found.error";
import { NoUserAuthenticatedError } from "@btpbilltracker/auth";
import { BillAmountBelowMinError } from "../errors/bill-amount-below-min.error";
import { BillDueDateRequiredError } from "../errors/bill-due-date-required.error";
import { BillExternalReferenceRequiredError } from "../errors/bill-external-reference-required.error";
import { InvalidBillTypeError } from "../errors/invalid-bill-type.error";
import { InvalidPaymentModeError } from "../errors/invalid-payment-mode.error";
import { BillPersistenceError } from "../errors/bill-persistence.error";
import { ReminderScenarioRequiredError } from "../errors/reminder-scenario-required.error";

export type EditBillInput = {
    billId: string;
    clientId?: string;
    chantierId?: string;
    amountTTC?: number;
    dueDate?: string;
    externalInvoiceReference?: string;
    type?: string;
    paymentMode?: string;
    reminderScenarioId?: string;
    billDocumentId?: string;
    billPdfFile?: File;
};

export class EditBillUseCase {
    constructor(
        private readonly repository: BillRepository,
        private readonly currentUser: AuthProvider,
    ) {}

    async execute(input: EditBillInput): Promise<Result<Bill>> {
        try {
            const owner = await this.currentUser.getCurrentUser();
            if (!owner) {
                throw new NoUserAuthenticatedError();
            }

            const bill = await this.repository.findById(input.billId);
            if (!bill) {
                throw new BillNotFoundError(input.billId);
            }

            if (input.clientId) bill.setClientId(input.clientId);
            if (input.chantierId) bill.setChantierId(input.chantierId);
            if (input.amountTTC) bill.setAmountTTC(input.amountTTC);
            if (input.dueDate) bill.setDueDate(input.dueDate);
            if (input.externalInvoiceReference) bill.setExternalInvoiceReference(input.externalInvoiceReference);
            if (input.type) bill.setType(input.type);
            if (input.paymentMode) bill.setPaymentMode(input.paymentMode);
            if (input.reminderScenarioId) bill.configureReminder(input.reminderScenarioId);
            if (input.billDocumentId) bill.setBillDocumentId(input.billDocumentId);

            await this.repository.edit(bill, owner.uid);
            return success(bill);
        } catch (error: unknown) {
            if (
                error instanceof BillNotFoundError ||
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
            throw error;
        }
    }
}
