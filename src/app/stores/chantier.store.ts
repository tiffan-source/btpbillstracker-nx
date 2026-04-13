import { Chantier } from "@btpbilltracker/chantiers";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

type ChantierViewModel = {
    id: string;
    name: string;
}

type ChantierState = {
    chantiers: ChantierViewModel[];
    isLoading: boolean;
};

const initialState: ChantierState = {
    chantiers: [],
    isLoading: false
};

export const ChantierStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store)=>({
        setChantiers(chantiers: ChantierViewModel[]) {
            patchState(store, (state) => ({...state, chantiers}));
        },
        setIsLoading(isLoading: boolean) {
            patchState(store, (state) => ({...state, isLoading}));
        },
        addChantier(chantier: ChantierViewModel) {
            patchState(store, (state) => ({...state, chantiers: [...state.chantiers, chantier]}));
         }
    }))
);