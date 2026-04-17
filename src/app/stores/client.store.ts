import { patchState, signalStore, withMethods, withState } from "@ngrx/signals"

type ClientViewModel = {
    id: string;
    firstName: string;
    lastName: string;
}

type ClientState = {
    clients: ClientViewModel[];
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
        setClients(clients: ClientViewModel[]) {
            patchState(store, (state) => ({...state, clients}));
        },
        setIsLoading(isLoading: boolean) {
            patchState(store, (state) => ({...state, isLoading}));
        },
        addClient(client: ClientViewModel) {
            patchState(store, (state) => ({...state, clients: [...state.clients, client]}));
        }
    }))
);