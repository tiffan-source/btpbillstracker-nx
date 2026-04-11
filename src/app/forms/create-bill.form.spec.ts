import { CreateBillForm, BillFormField } from './create-bill.form';

describe('CreateBillForm', () => {
  let form: CreateBillForm;

  beforeEach(() => {
    form = new CreateBillForm();
  });

  it('should initialize in existing client and chantier mode', () => {
    expect(form.isInNewMode('client')).toBe(false);
    expect(form.isInNewMode('chantier')).toBe(false);
    expect(form.controls[BillFormField.ClientId].enabled).toBe(true);
    expect(form.controls[BillFormField.ChantierId].enabled).toBe(true);
    expect(form.controls[BillFormField.NewClientName].disabled).toBe(true);
    expect(form.controls[BillFormField.NewChantierName].disabled).toBe(true);
  });

  it('should apply client rules declaratively when toggling mode', () => {
    form.controls[BillFormField.ClientId].setValue('client-1');
    form.toggleMode('client');

    expect(form.isInNewMode('client')).toBe(true);
    expect(form.controls[BillFormField.ClientId].disabled).toBe(true);
    expect(form.controls[BillFormField.ClientId].value).toBeNull();
    expect(form.controls[BillFormField.NewClientName].enabled).toBe(true);

    form.controls[BillFormField.NewClientName].setValue('');
    form.controls[BillFormField.NewClientName].markAsTouched();
    expect(form.controls[BillFormField.NewClientName].hasError('required')).toBe(true);

    form.toggleMode('client');
    expect(form.isInNewMode('client')).toBe(false);
    expect(form.controls[BillFormField.ClientId].enabled).toBe(true);
    expect(form.controls[BillFormField.NewClientName].disabled).toBe(true);

    form.controls[BillFormField.ClientId].setValue('');
    form.controls[BillFormField.ClientId].markAsTouched();
    expect(form.controls[BillFormField.ClientId].hasError('required')).toBe(true);
  });

  it('should apply chantier rules declaratively when toggling mode', () => {
    form.controls[BillFormField.ChantierId].setValue('chantier-1');
    form.toggleMode('chantier');

    expect(form.isInNewMode('chantier')).toBe(true);
    expect(form.controls[BillFormField.ChantierId].disabled).toBe(true);
    expect(form.controls[BillFormField.ChantierId].value).toBeNull();
    expect(form.controls[BillFormField.NewChantierName].enabled).toBe(true);

    form.controls[BillFormField.NewChantierName].setValue('');
    form.controls[BillFormField.NewChantierName].markAsTouched();
    expect(form.controls[BillFormField.NewChantierName].hasError('required')).toBe(true);
  });
});
