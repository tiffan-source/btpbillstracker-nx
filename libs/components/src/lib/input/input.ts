import { Component, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

type InputType = 'text' | 'number' | 'password' | 'email' | 'tel';

@Component({
  selector: 'lib-input',
  imports: [InputTextModule],
  templateUrl: './input.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: Input,
      multi: true
    }
  ]
})
export class Input implements ControlValueAccessor {

    type = input<InputType>('text');
    placeholder = input<string>('');
    id = input<string>('');
    invalid = input<boolean>(false);

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
