import { Bill } from '../domains/bill.entity';
import { BillRepository } from '../ports/bill.repository';
import { ReferenceGeneratorService } from '../ports/reference-generator.service';
import { CreateEnrichedBillUseCase } from './create-enriched-bill.usecase';
import { Result, success } from '@btpbilltracker/chore';
import { IdGeneratorPort } from '@btpbilltracker/chore';

class InMemoryBillRepository implements BillRepository {
  savedBill: Bill | null = null;

  async save(bill: Bill): Promise<void> {
    this.savedBill = bill;
  }

  async list(): Promise<Bill[]> {
    return this.savedBill ? [this.savedBill] : [];
  }

  async listByOwner(userId: string): Promise<Bill[]> {
    return this.list();
  }

  async update(bill: Bill): Promise<void> {
    this.savedBill = bill;
  }
}

class StaticReferenceGenerator implements ReferenceGeneratorService {
  async generate(): Promise<string> {
    return 'F-2026-0100';
  }
}

class StaticIdGenerator implements IdGeneratorPort {
  generate(): string {
    return 'bill-id-456';
  }
}



describe('CreateEnrichedBillUseCase', () => {
  it('creates and saves an enriched bill from a valid payload', async () => {
    const repository = new InMemoryBillRepository();
    const referenceGenerator = new StaticReferenceGenerator();
    const idGenerator = new StaticIdGenerator();
    const useCase = new CreateEnrichedBillUseCase(
      repository,
      referenceGenerator,
      idGenerator,
    );

    const result = await useCase.execute({
      clientId: 'client-123',
      amountTTC: 3200,
      dueDate: '2026-04-20',
      externalInvoiceReference: 'EXT-7788',
      type: 'Situation',
      paymentMode: 'Virement',
      chantierId: 'chantier-1',
      reminderScenarioId: 'standard-reminder-scenario',
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.clientId).toBe('client-123');
    expect(result.data.id).toBe('bill-id-456');
    expect(result.data.reference).toBe('F-2026-0100');
    expect(result.data.amountTTC).toBe(3200);
    expect(result.data.dueDate).toBe('2026-04-20');
    expect(result.data.externalInvoiceReference).toBe('EXT-7788');
    expect(result.data.type).toBe('Situation');
    expect(result.data.paymentMode).toBe('Virement');
    expect(result.data.chantierId).toBe('chantier-1');
    expect(repository.savedBill).toBe(result.data);
  });

  it('fails when amount TTC is negative', async () => {
    const repository = new InMemoryBillRepository();
    const referenceGenerator = new StaticReferenceGenerator();
    const idGenerator = new StaticIdGenerator();
    const useCase = new CreateEnrichedBillUseCase(
      repository,
      referenceGenerator,
      idGenerator
    );

    const result = await useCase.execute({
      clientId: 'client-123',
      amountTTC: -1,
      dueDate: '2026-04-20',
      externalInvoiceReference: 'EXT-7788',
      type: 'Situation',
      paymentMode: 'Virement',
      chantierId: 'chantier-1',
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.code).toBe('BILL_AMOUNT_BELOW_MIN');
    expect(result.error.message).toBe('Le montant TTC doit être supérieur ou égal à 0.');
    expect(repository.savedBill).toBeNull();
  });

  it("fails when due date is missing", async () => {
    const repository = new InMemoryBillRepository();
    const referenceGenerator = new StaticReferenceGenerator();
    const idGenerator = new StaticIdGenerator();
    const useCase = new CreateEnrichedBillUseCase(
      repository,
      referenceGenerator,
      idGenerator,
    );

    const result = await useCase.execute({
      clientId: 'client-123',
      amountTTC: 100,
      dueDate: ' ',
      externalInvoiceReference: 'EXT-7788',
      type: 'Situation',
      paymentMode: 'Virement',
      chantierId: 'chantier-1', 
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.code).toBe('BILL_DUE_DATE_REQUIRED');
    expect(result.error.message).toBe("La date d'échéance est obligatoire.");
    expect(repository.savedBill).toBeNull();
  });

  it('fails when external invoice reference is missing', async () => {
    const repository = new InMemoryBillRepository();
    const referenceGenerator = new StaticReferenceGenerator();
    const idGenerator = new StaticIdGenerator();
    const useCase = new CreateEnrichedBillUseCase(
      repository,
      referenceGenerator,
      idGenerator
    );

    const result = await useCase.execute({
      clientId: 'client-123',
      amountTTC: 100,
      dueDate: '2026-04-20',
      externalInvoiceReference: '',
      type: 'Situation',
      paymentMode: 'Virement',
      chantierId: 'chantier-1',
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.code).toBe('BILL_EXTERNAL_REFERENCE_REQUIRED');
    expect(result.error.message).toBe('La référence facture externe est obligatoire.');
    expect(repository.savedBill).toBeNull();
  });

  it('fails when bill type is not coherent', async () => {
    const repository = new InMemoryBillRepository();
    const referenceGenerator = new StaticReferenceGenerator();
    const idGenerator = new StaticIdGenerator();
    const useCase = new CreateEnrichedBillUseCase(
      repository,
      referenceGenerator,
      idGenerator,
    );

    const result = await useCase.execute({
      clientId: 'client-123',
      amountTTC: 100,
      dueDate: '2026-04-20',
      externalInvoiceReference: 'EXT-7788',
      type: 'InvalidType',
      paymentMode: 'Virement',
        chantierId: 'chantier-1',
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    expect(result.error.code).toBe('INVALID_BILL_TYPE');
    expect(result.error.message).toBe("Le type de facture est invalide. Valeurs autorisées: Situation, Solde, Acompte.");
  });

  it('fails when payment mode is not coherent', async () => {
    const repository = new InMemoryBillRepository();
    const referenceGenerator = new StaticReferenceGenerator();
    const idGenerator = new StaticIdGenerator();
    const useCase = new CreateEnrichedBillUseCase(
      repository,
      referenceGenerator,
      idGenerator,
    );

    const result = await useCase.execute({
      clientId: 'client-123',
      amountTTC: 100,
      dueDate: '2026-04-20',
      externalInvoiceReference: 'EXT-7788',
      type: 'Situation',
      paymentMode: 'Carte',
        chantierId: 'chantier-1',
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    expect(result.error.code).toBe('INVALID_PAYMENT_MODE');
    expect(result.error.message).toBe('Le mode de paiement est invalide. Valeurs autorisées: Virement, Chèque, Espèces.');
  });

  it('fails when reminders are enabled without scenario id', async () => {
    const repository = new InMemoryBillRepository();
    const referenceGenerator = new StaticReferenceGenerator();
    const idGenerator = new StaticIdGenerator();
    const useCase = new CreateEnrichedBillUseCase(
      repository,
      referenceGenerator,
      idGenerator,
    );

    const result = await useCase.execute({
      clientId: 'client-123',
      amountTTC: 100,
      dueDate: '2026-04-20',
      externalInvoiceReference: 'EXT-7788',
      type: 'Situation',
      paymentMode: 'Virement',
      reminderScenarioId: '',
      chantierId: 'chantier-1',
    });

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.code).toBe('REMINDER_SCENARIO_REQUIRED');
    expect(repository.savedBill).toBeNull();
  });

  it('persists reminder relation when enabled with scenario id', async () => {
    const repository = new InMemoryBillRepository();
    const referenceGenerator = new StaticReferenceGenerator();
    const idGenerator = new StaticIdGenerator();
    const useCase = new CreateEnrichedBillUseCase(
      repository,
      referenceGenerator,
      idGenerator,
    );

    const result = await useCase.execute({
      clientId: 'client-123',
      amountTTC: 3200,
      dueDate: '2026-04-20',
      externalInvoiceReference: 'EXT-7788',
      type: 'Situation',
      paymentMode: 'Virement',
      reminderScenarioId: 'standard-reminder-scenario',
        chantierId: 'chantier-1',
    });

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.data.reminderScenarioId).toBe('standard-reminder-scenario');
  });


});
