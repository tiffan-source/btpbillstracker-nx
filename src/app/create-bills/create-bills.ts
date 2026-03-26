import { Component } from '@angular/core';
import { Card } from "@btpbilltracker/components"

@Component({
  selector: 'app-create-bills',
  imports: [Card],
  templateUrl: './create-bills.html',
})
export class CreateBills {
    isCreatingNewClient = false;
    isCreatingNewChantier = false;

    onValueSelected(value: string) {
        console.log('Selected value:', value);
    }

    toggleNewClientMode() {
        this.isCreatingNewClient = !this.isCreatingNewClient;
    }

    toggleNewChantierMode() {
        this.isCreatingNewChantier = !this.isCreatingNewChantier;
    }
}
