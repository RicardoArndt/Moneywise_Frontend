import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from './models/menu-item';
import { OpenCloseService } from './services/open-close.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'moneywise-app-menu-items',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <ul 
      class="menu-items menu-items__container animate__animated" 
      [ngClass]="{
        'animate__slideInLeft': menuItemsAreOpen(),
        'animate__slideOutRight': !menuItemsAreOpen()
      }">
      @for (menuItem of menuItems; track menuItem.id) {
        <li class="menu-items__list">
          <a 
            class="menu-items__link"
            [routerLink]="menuItem.routerLink"
            (click)="closeMenu()"
            routerLinkActive="menu-items__link--active" 
            ariaCurrentWhenActive="page">
            {{ menuItem.title }}
          </a>
        </li>
      }
    </ul>
  `
})
export class MenuItemsComponent {
  public readonly menuItemsAreOpen;

  constructor(private readonly openCloseService: OpenCloseService) {
    this.menuItemsAreOpen = toSignal(this.openCloseService.getIsOpened());
  }

  public menuItems: MenuItem[] = [
    new MenuItem(1, 'Dashboard', ''),
    new MenuItem(2, 'Vendas', 'sales'),
    new MenuItem(3, 'Fluxo de Caixa', 'cash-flow'),
    new MenuItem(4, 'Users', 'users'),
    new MenuItem(5, 'Settings', 'settings'),
  ];

  public closeMenu() {
    this.openCloseService.close();
  }
}
