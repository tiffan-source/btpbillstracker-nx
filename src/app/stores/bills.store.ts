import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { Bill } from "libs/bills/src/lib/domains/bill.entity";

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

export function fromEntityToViewModel(bill: Bill): BillViewModel {
    return {
        id: bill.id,
        amount: bill.amountTTC || 0,
        dueDate: bill.dueDate || '',
        status: bill.status === 'PAID' ? 'paid' : 'unpaid',
        clientId: bill.clientId,
        chantierId: bill.chantierId ,
        invoiceNumber: bill.externalInvoiceReference || '',
        type: bill.type || '',
        paymentMode: bill.paymentMode || '',
        reminderScenarioId: bill.reminderScenarioId || null
    }
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