import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

type ReminderViewModel = {
    id: string;
    title: string;
    messagesToSend: ReminderMessageViewModel[];
};

type ReminderMessageViewModel = {
    interval: number;
    messageTitle: string;
    emailMessage: string;
    smsMessage: string;
};

type ReminderMessageState = {
    reminder: ReminderViewModel[];
    loading: boolean;
};

const initialState: ReminderMessageState = {
    reminder: [],
    loading: false
};

export const ReminderMessageStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store) => ({
        setReminders(reminders: ReminderViewModel[]) {
            patchState(store, (state) => ({...state, reminder: reminders}));
        },
        setLoading(loading: boolean) {
            patchState(store, (state) => ({...state, loading}));
        }
    }))
)