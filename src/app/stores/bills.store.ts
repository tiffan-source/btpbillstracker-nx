import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

type BillViewModel = {
    id: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'unpaid';
    clientId: string;
    chantierId: string;
    invoiceNumber: string;
    type: string;
    paymentMode: string;
    reminderScenarioId: string | null;
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
        },
        updateBill(bill: BillViewModel) {
            patchState(store, (state) => ({
                ...state,
                bills: state.bills.map((currentBill) => currentBill.id === bill.id ? bill : currentBill)
            }));
        }
    }))
);