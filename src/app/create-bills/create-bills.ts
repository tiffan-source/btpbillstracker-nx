import { Component } from '@angular/core';
import { Surface, Input, SurfaceHeader, SurfaceTitle, SurfaceContent, Label, SelectComponent, SelectItemComponent, SelectContentComponent, SelectLabelComponent, SelectTriggerComponent, SelectSeparatorComponent } from "@btpbilltracker/components";

@Component({
  selector: 'app-create-bills',
  imports: [Surface, SurfaceHeader, SurfaceTitle, SurfaceContent, Label, SelectComponent, SelectItemComponent, SelectContentComponent, SelectTriggerComponent],
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
