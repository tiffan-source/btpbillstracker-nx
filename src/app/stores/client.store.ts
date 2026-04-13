import { Client } from "@btpbilltracker/clients";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals"

type ClientState = {
    clients: Client[];
    isLoading: boolean;
};

const initialState: ClientState = {
    clients: [],
    isLoading: false
};

export const ClientStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store)=>({
        setClients(clients: Client[]) {
            patchState(store, (state) => ({...state, clients}));
        },
        setIsLoading(isLoading: boolean) {
            patchState(store, (state) => ({...state, isLoading}));
        }
    }))
);