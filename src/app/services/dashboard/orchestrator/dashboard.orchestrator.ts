import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { GetBillPdfUrlUseCase } from "@btpbilltracker/bills";
import { BillStore } from "src/app/stores/bills.store";
import { ChantierStore } from "src/app/stores/chantier.store";
import { ClientStore } from "src/app/stores/client.store";
import { ReminderMessageStore } from "src/app/stores/pre-computed-message.store";

@Injectable({ providedIn: 'root' })
export class DashboardOrchestrator {
    private readonly clientStore = inject(ClientStore);
    private readonly chantierStore = inject(ChantierStore);
    private readonly billStore = inject(BillStore);
    private readonly reminderMessageStore = inject(ReminderMessageStore);
    private readonly getBillPdfUrlUseCase = inject(GetBillPdfUrlUseCase);

    billIdToConsult = signal<string | undefined>(undefined);

    billsLineTableData = computed(() => {
        const clients = this.clientStore.clients();
        const chantiers = this.chantierStore.chantiers();
        return this.billStore.bills().map((bill) => {

            const client = clients.find((c) => c.id === bill.clientId);
            const chantier = chantiers.find((c) => c.id === bill.chantierId);
            return {
                ...bill,
                clientName: client ? `${client.firstName} ${client.lastName}` : 'Inconnu',
                chantierName: chantier ? chantier.name : 'Inconnu',
                nextRelanceDate: bill.reminderScenarioId ? this.getNextRelanceDate(bill.reminderScenarioId) : '_'
            }
        })
    });

    private getNextRelanceDate = (relanceId: string): string => {
        const relance = this.reminderMessageStore.reminder().find(r => r.id === relanceId);
        if (!relance) {
            return '_';
        }

        const today = new Date();
        const nextRelance = relance.messagesToSend
            .map(m => ({...m, nextRelanceDate: new Date(today.getTime() + m.interval * 24 * 3600 * 1000)}))
            .filter(m => m.nextRelanceDate > today)
            .sort((a, b) => a.nextRelanceDate.getTime() - b.nextRelanceDate.getTime())[0];

        return nextRelance ? nextRelance.nextRelanceDate.toDateString() : '_';
    }

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
            if (dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear && bill.status === 'unpaid') {
                totalCashout += bill.amount;
            }
        });
        return totalCashout;
    });

    numberBillPending = computed(() => {
        return this.billStore.bills().filter(bill => bill.status === 'unpaid').length;
    });

    mostLateBills = computed(() => {
        const today = new Date();
        return this.billStore.bills()
            .filter(bill => {
                const dueDate = new Date(bill.dueDate);
                return dueDate < today && bill.status !== 'paid';
            })
            .sort((a, b) => {
                const dueDateA = new Date(a.dueDate);
                const dueDateB = new Date(b.dueDate);
                return dueDateA.getTime() - dueDateB.getTime();
            })
            .slice(0, 5).map(bill => {
                const client = this.clientStore.clients().find(c => c.id === bill.clientId);
                const chantier = this.chantierStore.chantiers().find(c => c.id === bill.chantierId);
                return {
                    ...bill,
                    clientName: client ? `${client.firstName} ${client.lastName}` : 'Inconnu',
                    chantierName: chantier ? chantier.name : 'Inconnu',
                    numberOfDaysLate: Math.floor((new Date().getTime() - new Date(bill.dueDate).getTime()) / (1000 * 3600 * 24))
                }
        });
    });

    billPdfUrl = resource({
        params: () => {
            const id = this.billIdToConsult();
            
            if (!id) {
                return undefined;
            }
            return { id };
        },

        loader: ({params}) => this.getBillPdfUrlUseCase.execute(params.id)
    })
    
}