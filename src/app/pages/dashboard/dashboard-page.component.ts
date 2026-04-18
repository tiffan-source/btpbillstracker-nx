import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button, KpiCard, KpiCardVariant, PageSubTitle, PageTitle, Panel, Table } from '@btpbilltracker/components';
import { DashboardOrchestrator } from 'src/app/services/dashboard/orchestrator/dashboard.orchestrator';

@Component({
  selector: 'app-dashboard-page',
  imports: [PageTitle, PageSubTitle, Button, KpiCard, Table, Panel],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
    readonly KpiCardVariant = KpiCardVariant;
    readonly dashboardOrchestrator = inject(DashboardOrchestrator);
    readonly router = inject(Router);

    goToCreateBill() {
        this.router.navigate(['/create-bill']);
    }
}
