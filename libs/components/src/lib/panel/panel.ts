import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'lib-panel',
  imports: [PanelModule],
  templateUrl: './panel.html',
  styleUrl: './panel.css',
})
export class Panel {}
