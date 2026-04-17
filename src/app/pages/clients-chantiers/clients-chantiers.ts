import { Component, inject } from '@angular/core';
import { Card, PageSubTitle, PageTitle, ProgressBar } from '@btpbilltracker/components';
import { ChantierOrchestrator } from 'src/app/services/chantiers/orchestrator/chantier.orchestrator';
import { ClientsOrchestrator } from 'src/app/services/clients/orchestrator/clients.orchestrator';

@Component({
  selector: 'app-clients-chantiers',
  imports: [PageTitle, PageSubTitle, Card, ProgressBar],
  templateUrl: './clients-chantiers.html',
})
export class ClientsChantiers {
    chantiersOrchestrator = inject(ChantierOrchestrator);
    clientsOrchestrator = inject(ClientsOrchestrator);
}
