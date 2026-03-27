import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-sidebar-item',
  imports: [],
  templateUrl: './sidebar-item.html',
  styleUrl: './sidebar-item.css',
})
export class SidebarItem {
    active = input<boolean>(false);
    text = input<string>();
    prime_icon_class = input<string>();
}
