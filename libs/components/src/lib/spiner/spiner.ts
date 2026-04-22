import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'lib-spiner',
  imports: [ProgressSpinnerModule],
  templateUrl: './spiner.html',
  styleUrl: './spiner.css',
})
export class Spiner {}
