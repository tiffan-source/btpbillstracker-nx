import { Component, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectModule } from 'primeng/select';


@Component({
  selector: 'lib-input-select',
  imports: [SelectModule, FormsModule],
  templateUrl: './input-select.html',
  styleUrl: './input-select.css',
    providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputSelect,
      multi: true
    }
  ]
})
export class InputSelect<T> implements ControlValueAccessor{
  placeholder = input<string>('');  
  id = input<string>('');  
  options = input<T[]>([]);  
  optionLabel = input.required<string>();
  optionValue = input<string>();
  invalid = input<boolean>(false);
  disabled = input<boolean>(false);
  isDisabled = signal(false);
    
  // Use signal for value  
  value = signal<T | null>(null);  
  
  onChange: any = () => {};  
  onTouched: any = () => {};  
  
  writeValue(obj: T): void {  
    this.value.set(obj);  
  }  
  
  registerOnChange(fn: any): void {  
    this.onChange = fn;  
  }  
    
  registerOnTouched(fn: any): void {  
    this.onTouched = fn;  
  }  

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
  
  updateValue(newValue: T) {  
    if (this.disabled() || this.isDisabled()) {
      return;
    }
    this.value.set(newValue);  
    this.onChange(newValue);  
    this.onTouched();  
  }  
}
