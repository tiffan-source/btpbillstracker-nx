import { Component, input } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'lib-progress-bar',
    imports: [ProgressBarModule],
  templateUrl: './progress-bar.html',
})
export class ProgressBar {
    value = input.required<number>();
}
