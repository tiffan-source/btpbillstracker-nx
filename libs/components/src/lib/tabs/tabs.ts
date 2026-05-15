import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'lib-tabs',
    imports: [TabsModule, NgTemplateOutlet],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
    // --- DONNÉES ET ÉTAT ---
  @Input() items: any[] = [];
  @Input() value: string = '0'; // L'onglet actif par défaut
  
  // --- CONFIGURATION ---
  @Input() scrollable: boolean = false;

  // --- CAPTURE DES TEMPLATES ---
  @ContentChild('tabHeader') headerTemplate!: TemplateRef<any>;
  @ContentChild('tabContent') contentTemplate!: TemplateRef<any>;
  @ContentChild('prevIcon') prevIconTemplate!: TemplateRef<any>;
  @ContentChild('nextIcon') nextIconTemplate!: TemplateRef<any>;
}
