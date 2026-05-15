import { Component, inject, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';


@Component({
  selector: 'lib-date-picker',
  imports: [DatePickerModule, FormsModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
})
export class DatePicker implements ControlValueAccessor {
    placeholder = input<string>('');
    id = input<string>('');

    value: Date | null = null;
    private onChange: any = (value: Date | null) => {};
    private onTouched: any = () => {};

    writeValue(obj: any): void {
        this.value = obj;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    updateValue(event: Date | null) {
        this.value = event;
        this.onChange(event);
        this.onTouched();
    }

    ngControl = inject(NgControl, { optional: true, self: true });

    constructor() {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    get control() {
        return this.ngControl?.control;
    }

}
