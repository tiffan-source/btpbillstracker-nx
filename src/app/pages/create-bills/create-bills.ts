import { Component } from '@angular/core';
import { Button, Card, DatePicker, Input, InputFile, InputSelect, Label, Toogle, PageTitle, PageSubTitle } from "@btpbilltracker/components"
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-bills',
  imports: [Card, Input, ReactiveFormsModule, InputSelect, Label, Button, DatePicker, InputFile, Toogle, PageTitle, PageSubTitle],
  templateUrl: './create-bills.html',
})
export class CreateBills {
    isCreatingNewClient = true;
    isCreatingNewChantier = false;

    toggleNewClientMode() {
        this.isCreatingNewClient = !this.isCreatingNewClient;
    }

    toggleNewChantierMode() {
        this.isCreatingNewChantier = !this.isCreatingNewChantier;
    }
}
