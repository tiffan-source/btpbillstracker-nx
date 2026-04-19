import { NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, input, output, TemplateRef } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'lib-modal',
  imports: [DialogModule, NgTemplateOutlet],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  visible = input(false);
  closed = output<void>();

  header = input('');
  width = input('25rem');

  @ContentChild('header') headerTemplate!: TemplateRef<any>;
  @ContentChild('footer') footerTemplate!: TemplateRef<any>;
}
