import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Button, SidebarItem } from "@btpbilltracker/components"
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-protected-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidebarItem, Button],
  host: {
    '(document:keydown.escape)': 'closeMobileMenu()'
  },
  templateUrl: './protected-shell.component.html',
})
export class ProtectedShellComponent {
  readonly isMobileMenuOpen = signal(false);
  readonly routerService = inject(Router);

  authService = inject(AuthService);

  navItem = [
    {
      text: "Dashboard",
      prime_icon_class: "pi pi-objects-column",
      route: "/dashboard"
    },
    {
      text: "Ajouter une facture",
      prime_icon_class: "pi pi-receipt",
      route: "/create-bill"
    },
    {
      text: "Modeles de messages",
      prime_icon_class: "pi pi-envelope",
      route: "/reminders-templates"
    },
    {
      text: "Clients & Chantiers",
      prime_icon_class: "pi pi-users",
      route: "/clients-chantiers"
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
