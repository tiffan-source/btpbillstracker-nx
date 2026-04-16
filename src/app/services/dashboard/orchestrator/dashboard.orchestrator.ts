import { computed, inject, Injectable } from "@angular/core";
import { BillStore } from "src/app/stores/bills.store";
import { ChantierStore } from "src/app/stores/chantier.store";
import { ClientStore } from "src/app/stores/client.store";

@Injectable({ providedIn: 'root' })
export class DashboardOrchestrator {
    private clientStore = inject(ClientStore);
    private chantierStore = inject(ChantierStore);
    private billStore = inject(BillStore);

    billsLineTableData = computed(() => {
        const clients = this.clientStore.clients();
        const chantiers = this.chantierStore.chantiers();
        return this.billStore.bills().map((bill) => {

            const client = clients.find((c) => c.id === bill.clientId);
            const chantier = chantiers.find((c) => c.id === bill.chantierId);
            return {
                ...bill,
                clientName: client ? `${client.firstName} ${client.lastName}` : 'Inconnu',
                chantierName: chantier ? chantier.name : 'Inconnu'
            }
        })
    });

    totalBillLate = computed(() => {
        const today = new Date();
        return this.billStore.bills().filter(bill => {
            const dueDate = new Date(bill.dueDate);
            return dueDate < today && bill.status !== 'paid';
        }).length;
    });

    totalAmountBillLate = computed(() => {
        const today = new Date();
        let totalLate = 0;
        this.billStore.bills().forEach(bill => {
            const dueDate = new Date(bill.dueDate);
            if (dueDate < today && bill.status !== 'paid') {
                totalLate += bill.amount;
            }
        });
        return totalLate;
    });

    toCashoutThisMonth = computed(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        let totalCashout = 0;
        this.billStore.bills().forEach(bill => {
            const dueDate = new Date(bill.dueDate);
            if (dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear) {
                totalCashout += bill.amount;
            }
        });
        return totalCashout;
    });

    numberBillPending = computed(() => {
        return this.billStore.bills().filter(bill => bill.status === 'unpaid').length;
    });
}