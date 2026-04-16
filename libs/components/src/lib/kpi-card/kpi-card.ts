import { Component, input } from '@angular/core';

export enum KpiCardVariant {
  DANGER = 'danger',
  WARNING = 'warning',
  NEUTRAL = 'neutral'
}

@Component({
  selector: 'lib-kpi-card',
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {
    readonly KpiCardVariant = KpiCardVariant;
    title = input<string>('');
    value = input<string>('');
    prime_icon = input<string>('');
    variant = input<KpiCardVariant>(KpiCardVariant.NEUTRAL);
}
