import { PaymentMode } from "../forms/bill.form.type";

export const paymentModeOptions: { label: string, value: PaymentMode }[] = [
    { label: "Virement", value: "Virement" },
    { label: "Chèque", value: "Chèque" },
    { label: "Espèces", value: "Espèces" },
    { label: "Carte bancaire", value: "Carte bancaire" },
]