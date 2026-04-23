import { TestBed } from '@angular/core/testing';
import { CreateEnrichedBillUseCase, UploadBillPdfUseCase } from '@btpbilltracker/bills';
import { CreateChantierUseCase } from '@btpbilltracker/chantiers';
import { CreateQuickClientUseCase } from '@btpbilltracker/clients';
import { vi } from 'vitest';
import { BillStore } from 'src/app/stores/bills.store';
import { ChantierStore } from 'src/app/stores/chantier.store';
import { ClientStore } from 'src/app/stores/client.store';
import { CreateBillsOrchestrator, CreateBillRequest } from './create-bills.orchestrator';

describe('CreateBillsOrchestrator', () => {
  let orchestrator: CreateBillsOrchestrator;
  let createBillUseCase: { execute: ReturnType<typeof vi.fn> };
  let createClientUseCase: { execute: ReturnType<typeof vi.fn> };
  let createChantierUseCase: { execute: ReturnType<typeof vi.fn> };
  let uploadBillPdfUseCase: { execute: ReturnType<typeof vi.fn> };
  let billStore: { addBill: ReturnType<typeof vi.fn> };
  let chantierStore: { addChantier: ReturnType<typeof vi.fn> };
  let clientStore: { addClient: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    createBillUseCase = { execute: vi.fn() };
    createClientUseCase = { execute: vi.fn() };
    createChantierUseCase = { execute: vi.fn() };
    uploadBillPdfUseCase = { execute: vi.fn() };
    billStore = { addBill: vi.fn() };
    chantierStore = { addChantier: vi.fn() };
    clientStore = { addClient: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        CreateBillsOrchestrator,
        { provide: CreateEnrichedBillUseCase, useValue: createBillUseCase as unknown as CreateEnrichedBillUseCase },
        { provide: CreateQuickClientUseCase, useValue: createClientUseCase as unknown as CreateQuickClientUseCase },
        { provide: CreateChantierUseCase, useValue: createChantierUseCase as unknown as CreateChantierUseCase },
        { provide: UploadBillPdfUseCase, useValue: uploadBillPdfUseCase as unknown as UploadBillPdfUseCase },
        { provide: BillStore, useValue: billStore },
        { provide: ChantierStore, useValue: chantierStore },
        { provide: ClientStore, useValue: clientStore },
      ],
    });

    orchestrator = TestBed.inject(CreateBillsOrchestrator);
  });

  it('creates bill using existing client and chantier ids', async () => {
    const request: CreateBillRequest = {
      type: 'Solde',
      amount: 1000,
      dueDate: '2026-04-10',
      paymentMode: 'Virement',
      invoiceNumber: 'INV-001',
      reminderScenarioId: null,
      billPdfFile: null,
      client: { mode: 'existing', clientId: 'client-1' },
      chantier: { mode: 'existing', chantierId: 'chantier-1' },
    };

    createBillUseCase.execute.mockResolvedValue({ success: true, data: { id: 'bill-1' } });

    const result = await orchestrator.createBillProcess(request);

    expect(result).toEqual({
      success: true,
      data: {
        billId: 'bill-1',
        clientId: 'client-1',
        chantierId: 'chantier-1',
      },
    });
    expect(createClientUseCase.execute).not.toHaveBeenCalled();
    expect(createChantierUseCase.execute).not.toHaveBeenCalled();
    expect(createBillUseCase.execute).toHaveBeenCalledWith({
      type: 'Solde',
      clientId: 'client-1',
      chantierId: 'chantier-1',
      amountTTC: 1000,
      dueDate: '2026-04-10',
      paymentMode: 'Virement',
      externalInvoiceReference: 'INV-001',
      reminderScenarioId: undefined,
    });
  });

  it('creates missing client and chantier before bill creation', async () => {
    const request: CreateBillRequest = {
      type: 'Acompte',
      amount: 500,
      dueDate: '2026-04-11',
      paymentMode: 'Carte bancaire',
      invoiceNumber: 'INV-002',
      reminderScenarioId: 'scenario-1',
      billPdfFile: null,
      client: { mode: 'new', clientName: 'Alpha' },
      chantier: { mode: 'new', chantierName: 'Villa A' },
    };

    createClientUseCase.execute.mockResolvedValue({ success: true, data: { id: 'client-2' } });
    createChantierUseCase.execute.mockResolvedValue({ success: true, data: { id: 'chantier-2' } });
    createBillUseCase.execute.mockResolvedValue({ success: true, data: { id: 'bill-2' } });

    const result = await orchestrator.createBillProcess(request);

    expect(result).toEqual({
      success: true,
      data: {
        billId: 'bill-2',
        clientId: 'client-2',
        chantierId: 'chantier-2',
      },
    });
    expect(createClientUseCase.execute).toHaveBeenCalledWith({ firstName: 'Alpha', lastName: 'CLIENT' });
    expect(createChantierUseCase.execute).toHaveBeenCalledWith({ name: 'Villa A' });
    expect(createBillUseCase.execute).toHaveBeenCalled();
  });

  it('returns deterministic workflow failure when client creation fails', async () => {
    const request: CreateBillRequest = {
      type: 'Situation',
      amount: 200,
      dueDate: '2026-04-12',
      paymentMode: 'Espèces',
      invoiceNumber: 'INV-003',
      reminderScenarioId: null,
      billPdfFile: null,
      client: { mode: 'new', clientName: 'Beta' },
      chantier: { mode: 'existing', chantierId: 'chantier-3' },
    };

    createClientUseCase.execute.mockResolvedValue({
      success: false,
      error: { code: 'CLIENT_ERROR', message: 'Cannot create client' },
    });

    const result = await orchestrator.createBillProcess(request);

    expect(result).toEqual({
      success: false,
      step: 'client',
      error: {
        code: 'CLIENT_ERROR',
        message: 'Failed to create client: Cannot create client',
      },
    });
    expect(orchestrator.processError()).toBe('Failed to create client: Cannot create client');
    expect(createChantierUseCase.execute).not.toHaveBeenCalled();
    expect(createBillUseCase.execute).not.toHaveBeenCalled();
  });

  it('stops workflow when chantier creation fails', async () => {
    const request: CreateBillRequest = {
      type: 'Situation',
      amount: 200,
      dueDate: '2026-04-12',
      paymentMode: 'Espèces',
      invoiceNumber: 'INV-003',
      reminderScenarioId: null,
      billPdfFile: null,
      client: { mode: 'new', clientName: 'Beta' },
      chantier: { mode: 'new', chantierName: 'Villa B' },
    };

    createClientUseCase.execute.mockResolvedValue({ success: true, data: { id: 'client-3' } });
    createChantierUseCase.execute.mockResolvedValue({
      success: false,
      error: { code: 'CHANTIER_ERROR', message: 'Cannot create chantier' },
    });

    const result = await orchestrator.createBillProcess(request);

    expect(result).toEqual({
      success: false,
      step: 'chantier',
      error: {
        code: 'CHANTIER_ERROR',
        message: 'Failed to create chantier: Cannot create chantier',
      },
    });
    expect(createBillUseCase.execute).not.toHaveBeenCalled();
  });

  it('propagates bill creation errors through public API', async () => {
    const request: CreateBillRequest = {
      type: 'Solde',
      amount: 300,
      dueDate: '2026-04-13',
      paymentMode: 'Chèque',
      invoiceNumber: 'INV-004',
      reminderScenarioId: null,
      billPdfFile: null,
      client: { mode: 'existing', clientId: 'client-4' },
      chantier: { mode: 'existing', chantierId: 'chantier-4' },
    };

    createBillUseCase.execute.mockResolvedValue({
      success: false,
      error: { code: 'BILL_ERROR', message: 'Bill persistence failed' },
    });

    const result = await orchestrator.createBillProcess(request);

    expect(result).toEqual({
      success: false,
      step: 'bill',
      error: { code: 'BILL_ERROR', message: 'Failed to create bill: Bill persistence failed' },
    });
    expect(orchestrator.processError()).toBe('Failed to create bill: Bill persistence failed');
    expect(orchestrator.isProcessing()).toBe(false);
  });

  it('returns typed step-level failure when an unexpected exception occurs', async () => {
    const request: CreateBillRequest = {
      type: 'Situation',
      amount: 200,
      dueDate: '2026-04-12',
      paymentMode: 'Espèces',
      invoiceNumber: 'INV-005',
      reminderScenarioId: null,
      billPdfFile: null,
      client: { mode: 'new', clientName: 'Beta' },
      chantier: { mode: 'existing', chantierId: 'chantier-3' },
    };

    createClientUseCase.execute.mockRejectedValue(new Error('Service unavailable'));

    const result = await orchestrator.createBillProcess(request);

    expect(result).toEqual({
      success: false,
      step: 'client',
      error: {
        code: 'UNEXPECTED_WORKFLOW_ERROR',
        message: 'Failed to create client: Service unavailable',
      },
    });
    expect(orchestrator.processError()).toBe('Failed to create client: Service unavailable');
    expect(createBillUseCase.execute).not.toHaveBeenCalled();
  });

  it('reconciles optimistic PDF linkage with persisted bill outcome after creation', async () => {
    const uploadedPdfId = 'pdf-uploaded';
    const persistedPdfId = 'pdf-persisted';
    const request: CreateBillRequest = {
      type: 'Solde',
      amount: 1000,
      dueDate: '2026-04-10',
      paymentMode: 'Virement',
      invoiceNumber: 'INV-001',
      reminderScenarioId: null,
      billPdfFile: new File(['content'], 'facture.pdf', { type: 'application/pdf' }),
      client: { mode: 'existing', clientId: 'client-1' },
      chantier: { mode: 'existing', chantierId: 'chantier-1' },
    };

    uploadBillPdfUseCase.execute.mockResolvedValue({ success: true, data: uploadedPdfId });
    createBillUseCase.execute.mockResolvedValue({ success: true, data: { id: 'bill-1', billDocumentId: persistedPdfId } });

    const result = await orchestrator.createBillProcess(request);

    expect(result).toEqual({
      success: true,
      data: {
        billId: 'bill-1',
        clientId: 'client-1',
        chantierId: 'chantier-1',
        billPdfId: persistedPdfId,
      },
    });
    expect(createBillUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        billDocumentId: uploadedPdfId,
      }),
    );
    expect(billStore.addBill).toHaveBeenCalledWith(
      expect.objectContaining({
        billPdfId: persistedPdfId,
      }),
    );
  });
});
