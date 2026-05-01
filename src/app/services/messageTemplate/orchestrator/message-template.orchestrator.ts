import { computed, inject, Injectable } from "@angular/core";
import {ReminderMessageStore} from "../../../stores/pre-computed-message.store"

@Injectable({ providedIn: 'root' })
export class MessageTemplateOrchestrator {
    private reminderMessageStore = inject(ReminderMessageStore);

    reminderMessage = computed(() => {
        let data = this.reminderMessageStore.reminder();
        return data;
    });
}