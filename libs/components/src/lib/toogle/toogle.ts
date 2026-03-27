import { Component } from '@angular/core';
import { ControlValueAccessor, FormsModule } from '@angular/forms';
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
export class Toogle implements ControlValueAccessor {
    private onChange: (value: any) => void = () => {};
    private onTouched: () => void = () => {};

    writeValue(obj: any): void {
        this.checked = obj ?? false;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        // Handle disabled state if needed
    }

    onToggleChange(value: boolean): void {
        this.checked = value;
        this.onChange(value);
        this.onTouched();
    }

    checked: boolean = false;
}
