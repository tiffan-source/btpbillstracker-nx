import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
@Component({
  selector: 'lib-toogle',
  imports: [
    FormsModule,
    ToggleSwitchModule
  ],
  templateUrl: './toogle.html',
  styleUrl: './toogle.css',
})
export class Toogle {
    disabled = input<boolean>();
    value = input<boolean>(false);
    valueChange = output<boolean>();

  onChange(value: boolean): void {
    this.valueChange.emit(value);
  }
}
