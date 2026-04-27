import { Component, effect, input, output, signal } from '@angular/core';
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
    checked = input<boolean>(false);
    disabled = input<boolean>(false);
    checkedChange = output<boolean>();

    protected value = signal(false);

    onToggleChange(value: boolean): void {
        if (this.disabled()) {
            return;
        }
        this.value.set(value);
        this.checkedChange.emit(value);
    }

    constructor() {
        effect(() => {
            this.value.set(this.checked());
        });
    }
}
