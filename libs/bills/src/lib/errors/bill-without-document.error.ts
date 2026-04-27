import { CoreError } from "@btpbilltracker/chore";

export class BillWithoutDocumentError extends CoreError {
    constructor() {
        super('BILL_WITHOUT_DOCUMENT', 'La facture ne possède pas de document associé.');
    }
}