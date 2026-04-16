import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';

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
    route = input<string>();
    router = inject(Router);

    goTo() {
        const targetRoute = this.route();

        if (targetRoute) {
            this.router.navigate([targetRoute]);
        }
    }
}
