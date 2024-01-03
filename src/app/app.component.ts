import { AfterViewInit, Component, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { ModalService } from './commons/modal/services/modal.service';
import { filter } from 'rxjs';

@Component({
  selector: 'moneywise-app',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    HeaderComponent
  ],
  template: `
    <moneywise-app-header />

    <ng-container #modal></ng-container>

    <main class="main">
        <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .main {
          padding: 2.5rem 2.5rem;
          font-size: 1.6rem;
      }
    `
  ]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('modal', { read: ViewContainerRef })
  public modal!: ViewContainerRef;

  constructor(
    private readonly modalService: ModalService
  ) { }

  public ngAfterViewInit(): void {
    this.modalService.getModal()
      .pipe(filter(modal => !!modal))
      .subscribe(modal => {
        this.modal.createComponent(modal?.modalType as Type<any>);
      });

    this.modalService.getModal()
      .pipe(filter(modal => !modal))
      .subscribe(() => {
        this.modal.clear();
      });
  }
}
