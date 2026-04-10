import { Bill } from './bill.entity';
import { BillClientRequiredError } from '../errors/bill-client-required.error';
import { BillExternalReferenceRequiredError } from '../errors/bill-external-reference-required.error';

describe('Bill Entity', () => {
  it('should create a valid Draft Bill automatically', () => {
    const bill = new Bill('bill-1', 'F-2026-0001', 'client-xyz', 'chantier-123');

    expect(bill.id).toBe('bill-1');
    expect(bill.externalInvoiceReference).toBe('F-2026-0001');
    expect(bill.clientId).toBe('client-xyz');
    expect(bill.status).toBe('DRAFT');
  });

  it('stores chantier relation using chantierId', () => {
    const bill = new Bill('bill-1', 'F-2026-0001', 'client-xyz', 'chantier-123');

    expect(bill.chantierId).toBe('chantier-123');
    expect(bill.chantier).toBe('chantier-123');
  });

    it('should fail if reference is empty or missing', () => {
        expect(() => new Bill('bill-1', '', 'client-xyz', 'chantier-123')).toThrow(BillExternalReferenceRequiredError);
        expect(() => new Bill('bill-1', '   ', 'client-xyz', 'chantier-123')).toThrow(BillExternalReferenceRequiredError);
    });

  it('should fail if clientId is empty or missing', () => {
    expect(() => new Bill('bill-1', 'F-2026-0001', '', 'chantier-123')).toThrow(BillClientRequiredError);
    expect(() => new Bill('bill-1', 'F-2026-0001', '   ', 'chantier-123')).toThrow(BillClientRequiredError);
  });
});