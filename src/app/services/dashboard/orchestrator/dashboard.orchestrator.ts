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
}