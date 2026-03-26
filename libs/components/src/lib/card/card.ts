import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'lib-card',
  imports: [CardModule],
  templateUrl: './card.html',
})
export class Card {
    title = input<string>('title');
    subtitle = input<string>('subtitle');
}
