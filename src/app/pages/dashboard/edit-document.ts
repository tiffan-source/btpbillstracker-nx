import { Component, input } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Button, Divider, InputFile, Label } from "@btpbilltracker/components";
import { BillFormField } from "src/app/forms/bill.form.type";
import { EditBillForm } from "src/app/forms/edit-bill.form";

@Component({
    selector: 'app-edit-document',
    templateUrl: './edit-document.html',
    imports: [ReactiveFormsModule, Label, InputFile, Button, Divider]
})
export class EditDocument {
    parentForm = input.required<EditBillForm>();
    previousDocumentExist = input.required<boolean>();
    protected BillFormField = BillFormField;

    onFileChange(file: File | null): void {
        this.parentForm().patchValue({
        [BillFormField.BillPdf]: file
        });
        
        this.parentForm().controls[BillFormField.BillPdf].updateValueAndValidity();
    }
}