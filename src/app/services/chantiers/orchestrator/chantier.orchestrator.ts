import { computed, inject, Injectable, signal } from "@angular/core";
import { CreateChantierUseCase } from "@btpbilltracker/chantiers";
import { ToastService } from "libs/components/src/lib/toast/toast";
import { BillStore } from "src/app/stores/bills.store";
import { ChantierStore } from "src/app/stores/chantier.store";

@Injectable({ providedIn: 'root' })
export class ChantierOrchestrator {
    private readonly chantierStore = inject(ChantierStore);
    private readonly billsStore = inject(BillStore);
    private readonly toastService = inject(ToastService);
    private readonly createChantierUseCase = inject(CreateChantierUseCase);

    operationInformation = signal<{
        isLoading: boolean
    }>({
        isLoading: false
    });

    chantierOptions = computed(() => {
        const chantiers = this.chantierStore.chantiers();
        
        return chantiers.map(chantier => ({
            label: chantier.name,
            value: chantier.id
        }));
    });
    
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

    async createChantier(name: string): Promise<string | null> {
        this.operationInformation.set({
            isLoading: true
        });

        let result = await this.createChantierUseCase.execute({ name });
        if (result.success) {
            this.operationInformation.set({
                isLoading: false
            });

            // Optimistic update
            this.chantierStore.addChantier({
                id: result.data.id,
                name
            });

            return result.data.id;
        } else {
            this.operationInformation.set({
                isLoading: false
            });
            this.toastService.showToast('error', "Une erreur est survenue lors de la création du chantier");
            return null;
        }
       
    }
}
