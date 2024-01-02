import { Component, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { TemplatePageTitleStrategy } from '../../app.config';
import { MenuItemsComponent } from './components/menu-items/menu-items.component';
import { OpenCloseService } from './components/menu-items/services/open-close.service';
import { delay, filter, takeWhile, tap } from 'rxjs';

@Component({
  selector: 'moneywise-app-header',
  standalone: true,
  imports: [
    CommonModule,
    MenuItemsComponent
  ],
  providers: [
    OpenCloseService
  ],
  template: `
    <header class="header">
      <div class="header__container">
        @defer {
          <button 
            class="btn btn__transparent btn--no-border"
            (click)="openCloseMenuItems()">
            <span 
              class="icon icon__menu" 
              [ngClass]="{'icon__menu--checked': menuItemsAreOpenWithoutDelay()}">
            </span>
          </button>

          <p class="header__title">{{ currentActiveItem() }}</p>
        } @loading (minimum 1s) {
          <p class="header__title">Carregando...</p>
        }
      </div>
    </header>

    <nav class="nav" [ngClass]="{'nav--active': menuItemsAreOpen()}">
      @if (menuItemsAreOpen()) {
        <moneywise-app-menu-items />
      }
    </nav>
  `
})
export class HeaderComponent implements OnInit, OnDestroy {
  public currentActiveItem: Signal<string>;
  public menuItemsAreOpen = signal(false);
  public menuItemsAreOpenWithoutDelay = signal(false);

  private isAlive = true;

  constructor(
    private readonly titleStrategy: TemplatePageTitleStrategy,
    private readonly openCloseService: OpenCloseService
  ) {
    this.currentActiveItem = toSignal(this.titleStrategy.getTitle(), { initialValue: '' });
  }

  public ngOnInit(): void {
    this.listenCloseMenu();
    this.listenOpenMenu();
  }

  public ngOnDestroy(): void {
    this.isAlive = false;
  }

  public openCloseMenuItems() {
    if (this.menuItemsAreOpen()) {
      this.openCloseService.close();

      return;
    }

    this.openCloseService.open();
  }

  private listenCloseMenu() {
    this.openCloseService
      .getIsOpened()
      .pipe(
        filter(isOpened => !isOpened),
        tap(() => this.menuItemsAreOpenWithoutDelay.update(_ => false)),
        delay(800),
        takeWhile(_ => this.isAlive))
      .subscribe(_ => {
        this.menuItemsAreOpen.update(_ => false);
      });
  }

  private listenOpenMenu() {
    this.openCloseService
      .getIsOpened()
      .pipe(
        filter(isOpened => isOpened),
        takeWhile(_ => this.isAlive))
      .subscribe(_ => {
        this.menuItemsAreOpen.update(_ => true);
        this.menuItemsAreOpenWithoutDelay.update(_ => true);
      });
  }
}
