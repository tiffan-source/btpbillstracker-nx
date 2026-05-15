import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button, KpiCard, KpiCardVariant, PageSubTitle, PageTitle, Panel, Table, Tags, ToastService } from '@btpbilltracker/components';
import { DashboardOrchestrator } from 'src/app/services/dashboard/orchestrator/dashboard.orchestrator';
import { EditBillsModal } from './edit-bills-modal';
import { PayBillOrchestrator } from 'src/app/services/bills/pay-bill/orchestrator/pay-bill.orchestrator';

@Component({
  selector: 'app-dashboard-page',
  imports: [PageTitle, PageSubTitle, Button, KpiCard, Table, Panel, EditBillsModal, Tags],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
    readonly KpiCardVariant = KpiCardVariant;
    readonly dashboardOrchestrator = inject(DashboardOrchestrator);
    readonly payBillOrchestrator = inject(PayBillOrchestrator);
    readonly router = inject(Router);
    toastService = inject(ToastService);

    billIdToEdit = signal<string | null>(null);

    constructor() {
        effect(() => {
            const pdfResource = this.dashboardOrchestrator.billPdfUrl;

            if (pdfResource.status() === 'resolved' && pdfResource.value()) {
                const result = pdfResource.value();

                if (result?.success) {
                    const openedWindow = window.open(result.data, '_blank', 'noopener,noreferrer');
                    
                    if (!openedWindow) {
                        this.toastService.showToast('error', 'Votre navigateur a bloqué l\'ouverture du PDF.');
                    }
                } else {
                    this.toastService.showToast('error', `Impossible de récupérer le PDF : ${result?.error.message}`);
                }

                this.dashboardOrchestrator.billIdToConsult.set(undefined);
            } 
            else if (pdfResource.status() === 'error') {
                this.toastService.showToast('error', 'Une erreur technique est survenue.');
                this.dashboardOrchestrator.billIdToConsult.set(undefined);
            }
        });
    }

    consultBillPdf(billId: string) {
        this.dashboardOrchestrator.billIdToConsult.set(billId);
    }

    goToCreateBill() {
        this.router.navigate(['/create-bill']);
    }

    openEditBillsModal(billId: string) {
      this.billIdToEdit.set(billId);
    }

}
