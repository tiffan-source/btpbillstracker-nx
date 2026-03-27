import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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

  navItem = [
    {
      text: "Ajouter une facture",
      prime_icon_class: "pi pi-receipt",
      route: "/bills"
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
