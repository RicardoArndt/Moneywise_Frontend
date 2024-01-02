import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../button/models/button';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'moneywise-app-actions',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent
  ],
  template: `
    <div class="actions">
        @for (button of actionButtons; track button.title) {
            <moneywise-app-button [button]="button" />
        }
    </div>
  `
})
export class TableActionsComponent {
  @Input()
  public actionButtons: Button[] = [];
}
