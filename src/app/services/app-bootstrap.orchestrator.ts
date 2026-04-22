import { inject, Injectable, signal } from "@angular/core";
import { GetAllUserClientsUseCase } from "@btpbilltracker/clients";
import { ClientStore } from "../stores/client.store";
import { filter, forkJoin, switchMap, take } from "rxjs";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop"
import { GetAllUserChantiersUseCase } from "@btpbilltracker/chantiers";
import { ChantierStore } from "../stores/chantier.store";
import { BillStore } from "../stores/bills.store";
import { BILL_STATUS, GetAllUserConnectedBillsUseCase } from "@btpbilltracker/bills";
import { GetAllPreRegisterRelanceModelUseCase } from "@btpbilltracker/reminders";
import { ReminderMessageStore } from "../stores/pre-computed-message.store";

@Injectable({ providedIn: 'root' })
export class AppBootstrapOrchestrator {
  private readonly triggered = signal(false);
  private readonly clientService = inject(GetAllUserClientsUseCase);
  private readonly chantierService = inject(GetAllUserChantiersUseCase);
  private readonly billService = inject(GetAllUserConnectedBillsUseCase);
  private readonly reminderService = inject(GetAllPreRegisterRelanceModelUseCase);
  
  private readonly billsStore = inject(BillStore);
  private readonly clientsStore = inject(ClientStore);
  private readonly chantiersStore = inject(ChantierStore);
  private readonly remindersStore = inject(ReminderMessageStore);

  constructor() {
    toObservable(this.triggered).pipe(
      filter(Boolean),
      take(1),
      switchMap(() =>
        forkJoin({
          clients: this.clientService.execute(),
          chantiers: this.chantierService.execute(),
          bills: this.billService.execute(),
        })
      ),
      takeUntilDestroyed()
    ).subscribe(({ clients, chantiers, bills }) => {
        let reminders = this.reminderService.execute();
        // This is trash.... Mapper should be setup as soon as possible to avoid this kind of code
        this.clientsStore.setClients(clients.success ? clients.data.map((c) => ({ id: c.id, firstName: c.firstName || '', lastName: c.lastName || '' })) : []);
        this.chantiersStore.setChantiers(chantiers.success ? chantiers.data.map((c) => ({ id: c.id, name: c.name })) : []);
        this.billsStore.setBills(bills.success ? bills.data.map((b) => (
            { 
                id: b.id,
                amount: b.amountTTC || 0,
                dueDate: b.dueDate || '',
                status: b.status === BILL_STATUS.PAID ? 'paid' : 'unpaid',
                clientId: b.clientId || '',
                chantierId: b.chantierId || '',
                invoiceNumber: b.externalInvoiceReference || '',
                type: b.type || '',
                paymentMode: b.paymentMode || '',
                reminderScenarioId: b.reminderScenarioId || null,
                billPdfId: b.billDocumentId || null,
             }
            )) : []);
        this.remindersStore.setReminders(reminders.success ? reminders.data.map((r) => ({
            id: r.id,
            title: r.title,
            messagesToSend: r.messagesToSend.map(m=>({
                interval: m.interval,
                messageTitle: m.messageTitle,
                emailMessage: m.emailMessage,
                smsMessage: m.smsMessage
            }))
        })) : []);

    });
  }

  trigger(): void {
    if (!this.triggered()) {
      this.triggered.set(true);
    }
  }
}