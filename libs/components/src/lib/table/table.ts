import { Component, ContentChild, TemplateRef, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'lib-table',
  imports: [TableModule, NgTemplateOutlet],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
    // Les données à afficher
  value = input.required<unknown[]>();

    // On capture le template nommé #header depuis le parent
    @ContentChild('header') headerTemplate!: TemplateRef<any>;
    
    // On capture le template nommé #body depuis le parent
    @ContentChild('body') bodyTemplate!: TemplateRef<any>;
}