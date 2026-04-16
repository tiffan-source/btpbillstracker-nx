import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

type BillViewModel = {
    id: string;
    amount: string;
    dueDate: string;
    status: 'paid' | 'unpaid';
    clientId: string;
    chantierId: string;
}

type BillState = {
    bills: BillViewModel[];
    isLoading: boolean;
};

const initialState: BillState = {
    bills: [],
    isLoading: false
};

export const BillStore = signalStore(
    {providedIn: 'root'},
    withState(initialState),
    withMethods((store)=>({
        setBills(bills: BillViewModel[]) {
            patchState(store, (state) => ({...state, bills}));
        },
        setIsLoading(isLoading: boolean) {
            patchState(store, (state) => ({...state, isLoading}));
        },
        addBill(bill: BillViewModel) {
            patchState(store, (state) => ({...state, bills: [...state.bills, bill]}));
        }
    }))
);