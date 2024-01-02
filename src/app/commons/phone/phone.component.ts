import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhonePipe } from '../pipes/phone.pipe';

@Component({
  selector: 'moneywise-app-phone',
  standalone: true,
  imports: [
    CommonModule,
    PhonePipe
  ],
  template: `
    <p>{{ phone | phone }}
  `
})
export class PhoneComponent {
  @Input()
  public phone: string = '';
}
