import RELANCES from "../data/relances.models.data.json"
import { Result, success } from "@btpbilltracker/chore";
import { Reminder } from "../domains/reminder";

export class GetAllPreRegisterRelanceModelUseCase {
    execute(): Result<Reminder[]> {
        let reminders: Reminder[] = [];
        for (const relance of RELANCES) {
            const reminder = new Reminder(relance.id, relance.name);
            for (const messageToSend of relance.step) {
                reminder.addMessageToSend(messageToSend.delay, messageToSend.name, messageToSend.emailTemplate, messageToSend.smsTemplate);
            }
            reminders.push(reminder);
        }
        return success(reminders);   
    }
}