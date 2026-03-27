import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-label',
  imports: [],
  templateUrl: './label.html',
  styleUrl: './label.css',
})
export class Label {
    label = input.required<string>();
    for = input<string>();
}
