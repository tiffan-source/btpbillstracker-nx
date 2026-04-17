import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarItem } from "@btpbilltracker/components"

@Component({
  selector: 'app-protected-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarItem],
  host: {
    '(document:keydown.escape)': 'closeMobileMenu()'
  },
  templateUrl: './protected-shell.component.html',
})
export class ProtectedShellComponent {
  readonly isMobileMenuOpen = signal(false);
  readonly routerService = inject(Router);

  navItem = [
    {
      text: "Dashboard",
      prime_icon_class: "pi pi-receipt",
      route: "/dashboard"
    },
    {
      text: "Ajouter une facture",
      prime_icon_class: "pi pi-receipt",
      route: "/create-bill"
    },
    {
      text: "Modeles de messages",
      prime_icon_class: "pi pi-receipt",
      route: "/reminders-templates"
    }
  ]

  onCLickNavItem(route: string): void {

  }

  isNavItemActive(route: string): boolean {
    return false;
  }

  openMobileMenu(): void {
    this.isMobileMenuOpen.set(true);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
