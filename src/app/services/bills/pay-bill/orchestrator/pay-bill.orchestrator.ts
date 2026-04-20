import { inject, Injectable } from "@angular/core";
import { PayMyBillUseCase } from "@btpbilltracker/bills";
import { BillStore, fromEntityToViewModel } from "src/app/stores/bills.store";

@Injectable({providedIn: 'root'})
export class PayBillOrchestrator {
    private payBillUseCase = inject(PayMyBillUseCase);
    private billStore = inject(BillStore);

    payBill = async (billId: string): Promise<boolean> => {
        const result = await this.payBillUseCase.execute(billId, {});

        if (result.success) {
            this.billStore.updateBill(fromEntityToViewModel(result.data));
            return true;
        }
        return false;   
    }
}