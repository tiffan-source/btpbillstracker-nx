import { Component, inject, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

type InputType = 'text' | 'number' | 'password' | 'email' | 'tel';

@Component({
  selector: 'lib-input',
  imports: [InputTextModule],
  templateUrl: './input.html',
})
export class Input implements ControlValueAccessor {

    type = input<InputType>('text');
    placeholder = input<string>('');
    id = input<string>('');

    value = signal<string | number>('');
    private onChange: (value: string | number) => void = () => {};
    private onTouched: () => void = () => {};

    writeValue(obj: string | number | null): void {
      this.value.set(obj ?? '');
    }

    registerOnChange(fn: (value: string | number) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    ngControl = inject(NgControl, { optional: true, self: true });

    constructor() {
        if (this.ngControl) {
            // ✅ 2. On indique au NgControl que ce composant est son ValueAccessor
            this.ngControl.valueAccessor = this;
        }
    }

    get control() {
        return this.ngControl?.control;
    }

    updateValue(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      const newValue = this.type() === 'number'
        ? Number(inputElement.value)
        : inputElement.value;

        this.value.set(newValue);
        this.onChange(newValue);
        this.onTouched();
    }
}
