import { 
  AfterViewInit, 
  Component, 
  ComponentRef, 
  Type, 
  ViewChild, 
  ViewContainerRef 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { HeaderComponent } from './layout/header/header.component';
import { ModalService } from './commons/modal/services/modal.service';
import { IModalComponent } from './commons/modal/models/modal';
import { ToastComponent } from './commons/toast/toast.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'moneywise-app',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    HeaderComponent,
    ToastComponent
  ],
  providers: [
    MessageService
  ],
  template: `
    <moneywise-app-header />

    <ng-container #modal></ng-container>

    <moneywise-app-toast />

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
        const componentRef: ComponentRef<IModalComponent<any>> = this.modal.createComponent(modal?.modalType as Type<any>);
        componentRef.instance.input = modal?.input;
      });

    this.modalService.getModal()
      .pipe(filter(modal => !modal))
      .subscribe(() => {
        this.modal.clear();
      });
  }
}
