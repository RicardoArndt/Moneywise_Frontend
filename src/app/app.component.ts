import {
  AfterViewInit,
  Component, ComponentRef, Type, ViewChild, ViewContainerRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastComponent } from './commons/toast/toast.component';
import { filter } from 'rxjs';
import { IModalComponent } from './commons/modal/models/modal';
import { ModalService } from './commons/modal/services/modal.service';

@Component({
  selector: 'moneywise-app',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    ToastComponent
  ],
  providers: [
    MessageService
  ],
  template: `
    <ng-container #modal></ng-container>

    <moneywise-app-toast />

    <router-outlet />
  `
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
          const componentRef: ComponentRef<IModalComponent<any>> = 
          this.modal.createComponent(modal?.modalType as Type<any>);
          componentRef.instance.input = modal?.input;
      });

      this.modalService.getModal()
      .pipe(filter(modal => !modal))
      .subscribe(() => {
          this.modal.clear();
      });
  }
}
