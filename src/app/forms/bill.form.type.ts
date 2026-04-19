export enum BillFormField {
    ClientId = 'clientId',
    NewClientName = 'newClientName',
    ChantierId = 'chantierId',
    NewChantierName = 'chantierName',
    AmountTTC = 'amountTTC',
    DueDate = 'dueDate',
    InvoiceNumber = 'invoiceNumber',
    Type = 'type',
    PaymentMode = 'paymentMode',
    ReminderScenarioId = 'reminderScenarioId'
}

export type TypeBill = 'Situation' | 'Solde' | 'Acompte';
export type PaymentMode = 'Virement' | 'Chèque' | 'Espèces' | 'Carte bancaire';
