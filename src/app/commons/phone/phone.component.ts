import { Component, Input, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';

import { PhonePipe } from '../pipes/phone.pipe';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'moneywise-app-phone',
  standalone: true,
  imports: [
    CommonModule,
    PhonePipe,
    FontAwesomeModule,
    ClipboardModule
  ],
  template: `
    <p (click)="onCopy()" [ngClass]="{'copy': copy}" [title]="copy ? 'Clique para copiar' : ''">
      {{ phone | phone }}
      @if (copy) {
        <fa-icon [icon]="faCopy"></fa-icon>
      }
    </p>
  `
})
export class PhoneComponent {
  @Input()
  public phone: string = '';

  @Input({
    transform: booleanAttribute
  })
  public copy: boolean = false;

  public faCopy = faCopy;

  constructor(
    private readonly clipboardService: ClipboardService,
    private readonly messageService: MessageService,
    private readonly phonePipe: PhonePipe
  ) { }

  public onCopy() {
    this.clipboardService.copy(this.phone);
    this.messageService.add({
      severity: "success",
      summary: "Copiado!",
      detail: `O telefone ${this.phonePipe.transform(this.phone)} foi copiado`
    })
  }
}
