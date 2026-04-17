import { Component, computed, inject, signal } from '@angular/core';
import { PageSubTitle, PageTitle, Card, Button } from '@btpbilltracker/components';
import { MessageTemplateOrchestrator } from 'src/app/services/messageTemplate/orchestrator/message-template.orchestrator';

@Component({
  selector: 'app-reminders-templates',
  imports: [PageTitle, PageSubTitle, Card, Button],
  templateUrl: './reminders-templates.html',
})
export class RemindersTemplates {
    reminderTemplateService = inject(MessageTemplateOrchestrator);

    private userSelectedId = signal<string | undefined>(undefined);

    idReminderViewActive = computed(() => {
        // Si l'utilisateur a cliqué sur un bouton, on priorise son choix
        const selected = this.userSelectedId();
        if (selected) {
            return selected;
        }

        const messages = this.reminderTemplateService.reminderMessage();
        return messages?.length > 0 ? messages[0].id : undefined;
    });

    activeTemplate = computed(() => {
        const activeId = this.idReminderViewActive();
        const messages = this.reminderTemplateService.reminderMessage();

        // Si on n'a pas d'ID ou pas de messages, on renvoie undefined
        if (!activeId || !messages) {
            return undefined;
        }

        // On cherche le message qui correspond à l'ID actif
        return messages.find(m => m.id === activeId);
    });

    swicthReminderTemplate(id: string) {
        this.userSelectedId.set(id);
    }
}
