import { computed, inject, Injectable } from "@angular/core";
import { BillStore } from "src/app/stores/bills.store";
import { ChantierStore } from "src/app/stores/chantier.store";

@Injectable({ providedIn: 'root' })
export class ChantierOrchestrator {
    private readonly chantierStore = inject(ChantierStore);
    private readonly billsStore = inject(BillStore);

    chantiersInformation = computed(() => {
        return this.chantierStore.chantiers().map(chantier => {
            const totalAmountPaid = this.billsStore.bills().filter(bill => bill.chantierId === chantier.id && bill.status === 'paid').map(bill => bill.amount).reduce((a, b) => a + b, 0);
            const totalAmountNotPaid = this.billsStore.bills().filter(bill => bill.chantierId === chantier.id && bill.status !== 'paid').map(bill => bill.amount).reduce((a, b) => a + b, 0);

            return {
                id: chantier.id,
                name: chantier.name,
                totalAmountPaid,
                totalAmountNotPaid
            }
        })
    });
}