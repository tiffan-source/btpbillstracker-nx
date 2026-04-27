import { TestBed } from '@angular/core/testing';
import { DeleteBillPdfUseCase, EditBillUseCase, UploadBillPdfUseCase } from '@btpbilltracker/bills';
import { CreateChantierUseCase } from '@btpbilltracker/chantiers';
import { CreateQuickClientUseCase } from '@btpbilltracker/clients';
import { vi } from 'vitest';
import { BillStore } from 'src/app/stores/bills.store';
import { ChantierStore } from 'src/app/stores/chantier.store';
import { ClientStore } from 'src/app/stores/client.store';
import { EditBillRequest, EditBillsOrchestrator } from './edit-bills.orchestrator';

describe('EditBillsOrchestrator', () => {
  let orchestrator: EditBillsOrchestrator;
  let createClientUseCase: { execute: ReturnType<typeof vi.fn> };
  let createChantierUseCase: { execute: ReturnType<typeof vi.fn> };
  let editBillUseCase: { execute: ReturnType<typeof vi.fn> };
  let uploadBillPdfUseCase: { execute: ReturnType<typeof vi.fn> };
  let deleteBillPdfUseCase: { execute: ReturnType<typeof vi.fn> };
  let clientStore: { addClient: ReturnType<typeof vi.fn> };
  let chantierStore: { addChantier: ReturnType<typeof vi.fn> };
  let billStore: { bills: ReturnType<typeof vi.fn>; updateBill: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    createClientUseCase = { execute: vi.fn() };
    createChantierUseCase = { execute: vi.fn() };
    editBillUseCase = { execute: vi.fn() };
    uploadBillPdfUseCase = { execute: vi.fn() };
    deleteBillPdfUseCase = { execute: vi.fn() };
    clientStore = { addClient: vi.fn() };
    chantierStore = { addChantier: vi.fn() };
    billStore = { bills: vi.fn(() => []), updateBill: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        EditBillsOrchestrator,
        { provide: CreateQuickClientUseCase, useValue: createClientUseCase as unknown as CreateQuickClientUseCase },
        { provide: CreateChantierUseCase, useValue: createChantierUseCase as unknown as CreateChantierUseCase },
        { provide: EditBillUseCase, useValue: editBillUseCase as unknown as EditBillUseCase },
        { provide: UploadBillPdfUseCase, useValue: uploadBillPdfUseCase as unknown as UploadBillPdfUseCase },
        { provide: DeleteBillPdfUseCase, useValue: deleteBillPdfUseCase as unknown as DeleteBillPdfUseCase },
        { provide: ClientStore, useValue: clientStore },
        { provide: ChantierStore, useValue: chantierStore },
        { provide: BillStore, useValue: billStore },
      ],
    });

    orchestrator = TestBed.inject(EditBillsOrchestrator);
  });

  it('returns bill-step contextual error when edit fails', async () => {
    const request: EditBillRequest = {
      billId: 'bill-1',
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

    editBillUseCase.execute.mockResolvedValue({
      success: false,
      error: { code: 'BILL_ERROR', message: 'Persistence failed' },
    });

    const result = await orchestrator.editBillProcess(request);

    expect(result).toEqual({
      success: false,
      step: 'bill',
      error: { code: 'BILL_ERROR', message: 'Failed to update bill: Persistence failed' },
    });
    expect(orchestrator.processError()).toBe('Failed to update bill: Persistence failed');
  });

  it('returns typed step-level failure when client resolution throws', async () => {
    const request: EditBillRequest = {
      billId: 'bill-2',
      type: 'Situation',
      amount: 200,
      dueDate: '2026-04-11',
      paymentMode: 'Espèces',
      invoiceNumber: 'INV-002',
      reminderScenarioId: null,
      billPdfFile: null,
      client: { mode: 'new', clientName: 'Beta' },
      chantier: { mode: 'existing', chantierId: 'chantier-1' },
    };

    createClientUseCase.execute.mockRejectedValue(new Error('Client service unavailable'));

    const result = await orchestrator.editBillProcess(request);

    expect(result).toEqual({
      success: false,
      step: 'client',
      error: {
        code: 'UNEXPECTED_WORKFLOW_ERROR',
        message: 'Failed to create client: Client service unavailable',
      },
    });
    expect(orchestrator.processError()).toBe('Failed to create client: Client service unavailable');
    expect(editBillUseCase.execute).not.toHaveBeenCalled();
  });

  it('reconciles optimistic PDF linkage with persisted bill outcome after edit', async () => {
    const uploadedPdfId = 'pdf-uploaded';
    const persistedPdfId = 'pdf-persisted';
    const request: EditBillRequest = {
      billId: 'bill-3',
      type: 'Situation',
      amount: 200,
      dueDate: '2026-04-11',
      paymentMode: 'Espèces',
      invoiceNumber: 'INV-003',
      reminderScenarioId: null,
      billPdfFile: new File(['content'], 'facture.pdf', { type: 'application/pdf' }),
      client: { mode: 'existing', clientId: 'client-1' },
      chantier: { mode: 'existing', chantierId: 'chantier-1' },
    };

    uploadBillPdfUseCase.execute.mockResolvedValue({ success: true, data: uploadedPdfId });
    editBillUseCase.execute.mockResolvedValue({
      success: true,
      data: { id: 'bill-3', status: 'UNPAID', billDocumentId: persistedPdfId },
    });

    const result = await orchestrator.editBillProcess(request);

    expect(result).toEqual({
      success: true,
      data: {
        billId: 'bill-3',
        clientId: 'client-1',
        chantierId: 'chantier-1',
        billPdfId: persistedPdfId,
      },
    });
    expect(editBillUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        billDocumentId: uploadedPdfId,
      }),
    );
    expect(billStore.updateBill).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'bill-3',
        billPdfId: persistedPdfId,
      }),
    );
  });
});
