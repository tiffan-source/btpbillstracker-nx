import { Provider } from "@angular/core";
import { GetAllPreRegisterRelanceModelUseCase } from "@btpbilltracker/reminders";

export const REMINDER_PROVIDERS: Provider[] = [
    {provide: GetAllPreRegisterRelanceModelUseCase, useClass: GetAllPreRegisterRelanceModelUseCase}
];