import { inject, Injectable, signal } from "@angular/core";
import { GetAllUserClientsUseCase } from "@btpbilltracker/clients";
import { clientStore } from "../stores/client.store";
import { filter, forkJoin, switchMap, take } from "rxjs";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop"

@Injectable({ providedIn: 'root' })
export class AppBootstrapOrchestrator {
  private readonly triggered = signal(false);
  private readonly clientService = inject(GetAllUserClientsUseCase);
  private readonly clientsStore = inject(clientStore);

  constructor() {
    toObservable(this.triggered).pipe(
      filter(Boolean),
      take(1),
      switchMap(() =>
        forkJoin({
          clients: this.clientService.execute(),
        })
      ),
      takeUntilDestroyed()
    ).subscribe(({ clients }) => {
      this.clientsStore.setClients(clients.success ? clients.data : []);
    });
  }

  trigger(): void {
    if (!this.triggered()) {
      this.triggered.set(true);
    }
  }
}