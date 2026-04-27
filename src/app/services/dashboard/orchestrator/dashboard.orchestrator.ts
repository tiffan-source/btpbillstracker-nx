import { computed, inject, Injectable, resource, signal } from "@angular/core";
import { GetBillPdfUrlUseCase } from "@btpbilltracker/bills";
import { BillStore } from "src/app/stores/bills.store";
import { ChantierStore } from "src/app/stores/chantier.store";
import { ClientStore } from "src/app/stores/client.store";

type ViewBillPdfWorkflowStep = "bill" | "pdf";

export type ViewBillPdfResult =
    | {
            success: true;
            data: {
                url: string;
            };
        }
    | {
            success: false;
            step: ViewBillPdfWorkflowStep;
            error: {
                code: string;
                message: string;
            };
        };

@Injectable({ providedIn: 'root' })
export class DashboardOrchestrator {
    private clientStore = inject(ClientStore);
    private chantierStore = inject(ChantierStore);
    private billStore = inject(BillStore);
    private getBillPdfUrlUseCase = inject(GetBillPdfUrlUseCase);

    billIdToConsult = signal<string | undefined>(undefined);

    billsLineTableData = computed(() => {
        const clients = this.clientStore.clients();
        const chantiers = this.chantierStore.chantiers();
        return this.billStore.bills().map((bill) => {

            const client = clients.find((c) => c.id === bill.clientId);
            const chantier = chantiers.find((c) => c.id === bill.chantierId);
            return {
                ...bill,
                clientName: client ? `${client.firstName} ${client.lastName}` : 'Inconnu',
                chantierName: chantier ? chantier.name : 'Inconnu'
            }
        })
    });

    totalBillLate = computed(() => {
        const today = new Date();
        return this.billStore.bills().filter(bill => {
            const dueDate = new Date(bill.dueDate);
            return dueDate < today && bill.status !== 'paid';
        }).length;
    });

    totalAmountBillLate = computed(() => {
        const today = new Date();
        let totalLate = 0;
        this.billStore.bills().forEach(bill => {
            const dueDate = new Date(bill.dueDate);
            if (dueDate < today && bill.status !== 'paid') {
                totalLate += bill.amount;
            }
        });
        return totalLate;
    });

    toCashoutThisMonth = computed(() => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        let totalCashout = 0;
        this.billStore.bills().forEach(bill => {
            const dueDate = new Date(bill.dueDate);
            if (dueDate.getMonth() === currentMonth && dueDate.getFullYear() === currentYear && bill.status === 'unpaid') {
                totalCashout += bill.amount;
            }
        });
        return totalCashout;
    });

    numberBillPending = computed(() => {
        return this.billStore.bills().filter(bill => bill.status === 'unpaid').length;
    });

    mostLateBills = computed(() => {
        const today = new Date();
        return this.billStore.bills()
            .filter(bill => {
                const dueDate = new Date(bill.dueDate);
                return dueDate < today && bill.status !== 'paid';
            })
            .sort((a, b) => {
                const dueDateA = new Date(a.dueDate);
                const dueDateB = new Date(b.dueDate);
                return dueDateA.getTime() - dueDateB.getTime();
            })
            .slice(0, 5).map(bill => {
                const client = this.clientStore.clients().find(c => c.id === bill.clientId);
                const chantier = this.chantierStore.chantiers().find(c => c.id === bill.chantierId);
                return {
                    ...bill,
                    clientName: client ? `${client.firstName} ${client.lastName}` : 'Inconnu',
                    chantierName: chantier ? chantier.name : 'Inconnu',
                    numberOfDaysLate: Math.floor((new Date().getTime() - new Date(bill.dueDate).getTime()) / (1000 * 3600 * 24))
                }
        });
    });

    billPdfUrl = resource({
        params: () => {
            const id = this.billIdToConsult();
            
            if (!id) {
                return undefined;
            }
            return { id };
        },

        loader: ({params}) => this.getBillPdfUrlUseCase.execute(params.id)
    })
    
    
    // (billId: string): Promise<ViewBillPdfResult> {
    //     const bill = this.billStore.bills().find((currentBill) => currentBill.id === billId);
    //     if (!bill) {
    //         return {
    //             success: false,
    //             step: "bill",
    //             error: {
    //                 code: "BILL_NOT_FOUND",
    //                 message: "Impossible de retrouver la facture selectionnee.",
    //             },
    //         };
    //     }

    //     if (!bill.billPdfId) {
    //         return {
    //             success: false,
    //             step: "bill",
    //             error: {
    //                 code: "BILL_PDF_NOT_FOUND",
    //                 message: "Aucun PDF associe a cette facture.",
    //             },
    //         };
    //     }

    //     const result = await this.getBillPdfUrlUseCase.execute(bill.billPdfId);
    //     if (!result.success) {
    //         return {
    //             success: false,
    //             step: "pdf",
    //             error: {
    //                 code: result.error.code,
    //                 message: `Impossible de charger le PDF: ${result.error.message}`,
    //             },
    //         };
    //     }

    //     return {
    //         success: true,
    //         data: {
    //             url: result.data,
    //         },
    //     };
    // }
}