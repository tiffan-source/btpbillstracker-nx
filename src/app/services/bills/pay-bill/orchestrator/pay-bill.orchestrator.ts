import { inject, Injectable } from "@angular/core";
import { PayMyBillUseCase } from "@btpbilltracker/bills";
import { ToastService } from "libs/components/src/lib/toast/toast";
import { BillStore, fromEntityToViewModel } from "src/app/stores/bills.store";

@Injectable({providedIn: 'root'})
export class PayBillOrchestrator {
    private payBillUseCase = inject(PayMyBillUseCase);
    private readonly toastService = inject(ToastService);
    private billStore = inject(BillStore);

    payBill = async (billId: string): Promise<boolean> => {
        const result = await this.payBillUseCase.execute(billId, {});

        if (result.success) {
            this.billStore.updateBill(fromEntityToViewModel(result.data));
            return true;
        }
        this.toastService.showToast('error', "Une erreur est survenue lors du paiement de la facture");
        return false;   
    }
}