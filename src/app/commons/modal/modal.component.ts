import { Component, ContentChild, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './services/modal.service';
import { ButtonComponent } from '../button/button.component';
import { delay, filter, takeWhile, tap } from 'rxjs';
import { Button } from '../button/models/button';
import { ModalBodyDirective } from './directives/modal-body.directive';
import { ButtonType } from '../button/models/button-type';

@Component({
  selector: 'moneywise-app-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent
  ],
  template: `
    @if (isOpen()) {
      <div class="modal--projection" (click)="confirmCloseModal()"></div>
      
      @if (isConfirmDialogOpen()) {
        <div class="modal animate__animated"
          [ngClass]="
            {
              'animate__fadeIn': isOpen(), 
              'animate__fadeOut': !isOpenWithouDelay()
            }">
        
          <div class="modal__header">
            <h3>Fechar pop-up?</h3>
          </div>

          <div class="modal__body">
            <p>Deseja realmente fechar o pop-up?</p>
          </div>

          <div class="modal__footer">
            <moneywise-app-button left [button]="cancelButton" />
            <moneywise-app-button right [button]="confirmButton" />
          </div>
        </div>
      }
      
      <div class="modal animate__animated"
        [style.display]="isConfirmDialogOpen() ? 'none' : 'flex'"
        [ngClass]="
          {
            'animate__fadeIn': isOpen(), 
            'animate__fadeOut': !isOpenWithouDelay()
          }">
        <moneywise-app-button class="modal__btn--close" [button]="closeModalButton" />
      
        <div class="modal__header">
          <ng-content select="modal-header"></ng-content>
        </div>

        <div class="modal__body">
          <ng-container [ngTemplateOutlet]="content.templateRef"></ng-container>
        </div>

        <div class="modal__footer">
          <ng-content select="modal-footer"></ng-content>
        </div>
      </div>
    }
  `
})
export class ModalComponent implements OnInit, OnDestroy {
  @ContentChild(ModalBodyDirective) content!: ModalBodyDirective;

  public readonly isOpen = signal(false);
  public readonly isConfirmDialogOpen = signal(false);
  public readonly isOpenWithouDelay = signal(false);
  
  public readonly closeModalButton: Button = new Button(this.confirmCloseModal.bind(this), 'Fechar');

  public readonly cancelButton: Button = new Button(
    this.cancelCloseModal.bind(this), 
    'Não');
  
  public readonly confirmButton: Button = new Button(
    this.closeModal.bind(this), 
    'Sim', 
    undefined, 
    ButtonType.danger);

  private isAlive = true;

  public constructor(
    private readonly modalService: ModalService
  ) { }

  public ngOnInit(): void {
    this.listenIsOpen();
    this.listenIsNotOpen();
  }

  public ngOnDestroy(): void {
    this.isAlive = false;
  }

  public confirmCloseModal() {
    this.isConfirmDialogOpen.update(_ => true);
  }

  public closeModal() {
    this.modalService.close();
    this.isConfirmDialogOpen.update(_ => false);
  }

  public cancelCloseModal() {
    this.isConfirmDialogOpen.update(_ => false);
  }

  private listenIsNotOpen() {
    this.modalService
      .getIsOpen()
      .pipe(
        filter(isOpen => !isOpen),
        tap(_ => this.isOpenWithouDelay.update(_ => false)),
        delay(200),
        takeWhile(_ => this.isAlive)
      )
      .subscribe(_ => this.isOpen.update(_ => false));
  }

  private listenIsOpen() {
    this.modalService
      .getIsOpen()
      .pipe(
        filter(isOpen => isOpen),
        takeWhile(_ => this.isAlive)
      )
      .subscribe(_ => {
        this.isOpen.update(_ => true);
        this.isOpenWithouDelay.update(_ => true);
      });
  }
}
