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

    value = signal('');
    private onChange: any = (value: string) => {};
    private onTouched: any = () => {};

    increment() {
        const newValue = this.value() + 'a';
        this.value.set(newValue);
        this.onChange(newValue);
        this.onTouched();
    }

    writeValue(obj: any): void {
        this.value.set(obj);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    updateValue(event: Event) {
        const newValue = (event.target as HTMLInputElement).value;
        this.value.set(newValue);
        this.onChange(newValue);
        this.onTouched();
    }
}
