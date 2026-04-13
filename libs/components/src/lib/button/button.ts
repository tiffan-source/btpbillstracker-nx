import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

type ButtonVariant = "primary" | "secondary" | "danger";

@Component({
  selector: 'lib-button',
  imports: [ButtonModule],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
    label = input.required<string>();
    variant = input<ButtonVariant>('primary');
    prime_icon_class = input<string>();
    disable = input<boolean>();
    loading = input<boolean>();
}
