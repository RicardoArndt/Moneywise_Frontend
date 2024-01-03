import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { Button } from '../button/models/button';
import { ButtonType } from '../button/models/button-type';
import { DialogService } from './services/dialog.service';
import { ModalService } from '../modal/services/modal.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalBodyDirective } from '../modal/directives/modal-body.directive';
import { filter } from 'rxjs';

@Component({
  selector: 'moneywise-app-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ModalComponent,
    ModalBodyDirective
  ],
  template: `
    <moneywise-app-modal>
      <ng-container ngProjectAs="modal-header">
        {{ title() }}
      </ng-container>

      <ng-template moneywiseAppModalBody>
        {{ content() }}
      </ng-template>

      <ng-container ngProjectAs="modal-footer">
        <moneywise-app-button left [button]="discardButton" />
        <moneywise-app-button right [button]="confirmButton" />
      </ng-container>
    </moneywise-app-modal>
  `
})
export class DialogComponent implements OnInit {
    public id!: number;
    public title: WritableSignal<string> = signal('');
    public content: WritableSignal<string> = signal('');

    public discardButton: Button = new Button(this.discard.bind(this), 'Não', undefined, ButtonType.danger);
    public confirmButton: Button = new Button(this.confirm.bind(this), 'Sim', );

    constructor(
        private readonly dialogService: DialogService,
        private readonly modalService: ModalService
    ) { }

    public ngOnInit(): void {
        this.modalService.getModal()
            .pipe(filter(dialog => dialog?.modalType == DialogComponent))
            .subscribe((dialog) => {
                this.title.update(_ => dialog?.input.title ?? '');
                this.content.update(_ => dialog?.input.content ?? '');
                this.id = dialog?.input.id;
            });
    }

    public confirm() {
        this.dialogService.confirm(this.id);

        this.modalService.close();
    }

    public discard() {
        this.dialogService.discard();

        this.modalService.close();
    }
}
