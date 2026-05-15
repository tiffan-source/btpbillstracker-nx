import { Component, input, output } from "@angular/core";
import { Button, Card, InputFile, Label, PageSubTitle, PageTitle, Toast, ToastService } from "@btpbilltracker/components";
import { BillFormField } from "src/app/forms/bill.form.type";
import { CreateBillForm } from "src/app/forms/create-bill.form";
import { CreateOrSelectChantier } from "./create-or-select-chantier";
import { CreateOrSelectClient } from "./create-or-select-client";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: 'app-upload-pdf',
    imports: [ ReactiveFormsModule, InputFile, Card, Button, Label],
    templateUrl: './upload-pdf.html',
})
export class UploadPdf {
    readonly  parentForm = input.required<CreateBillForm>();
    protected readonly BillFormField = BillFormField;

    readonly goNext = output<void>(); // <-- Événement
    readonly goPrevious = output<void>(); // <-- Événement

    onFileChange(file: File | null): void {
        this.parentForm().patchValue({
        [BillFormField.BillPdf]: file
        });
        
        this.parentForm().controls[BillFormField.BillPdf].updateValueAndValidity();
    }
}