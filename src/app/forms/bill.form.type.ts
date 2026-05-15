import { FormControl } from "@angular/forms";

export enum BillFormField {
    ClientId = 'clientId',
    ChantierId = 'chantierId',
    AmountTTC = 'amountTTC',
    DueDate = 'dueDate',
    InvoiceNumber = 'invoiceNumber',
    Type = 'type',
    PaymentMode = 'paymentMode',
    ReminderScenarioId = 'reminderScenarioId',
    BillPdf = 'billPdf'
}


export type BillForm = {
    [BillFormField.ClientId] : FormControl<string>,
    [BillFormField.ChantierId] : FormControl<string>,
    [BillFormField.AmountTTC] : FormControl<number>,
    [BillFormField.DueDate] : FormControl<Date>,
    [BillFormField.InvoiceNumber] : FormControl<string>,
    [BillFormField.Type] : FormControl<TypeBill>,
    [BillFormField.PaymentMode] : FormControl<PaymentMode>,
    [BillFormField.ReminderScenarioId] : FormControl<string | null>,
    [BillFormField.BillPdf] : FormControl<File | null>
}

export type TypeBill = 'Situation' | 'Solde' | 'Acompte';
export type PaymentMode = 'Virement' | 'Chèque' | 'Espèces' | 'Carte bancaire';
