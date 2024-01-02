import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Status } from './models/status';

@Component({
  selector: 'moneywise-app-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="status">
        <span class="status__type status__{{status?.type}}"></span>
        {{status?.description}}
    </div>
  `
})
export class StatusComponent {
  @Input('status')
  public status?: Status;
}
 