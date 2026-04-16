import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button, KpiCard, KpiCardVariant, PageSubTitle, PageTitle, Table } from '@btpbilltracker/components';
import { DashboardOrchestrator } from 'src/app/services/dashboard/orchestrator/dashboard.orchestrator';

@Component({
  selector: 'app-dashboard-page',
  imports: [PageTitle, PageSubTitle, Button, KpiCard, Table],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent {
    readonly KpiCardVariant = KpiCardVariant;
    readonly dashboardOrchestrator = inject(DashboardOrchestrator);
}
