import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'moneywise-app-currency',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <p class="currency">{{ value | currency:'BRL' }}</p>
  `
})
export class CurrencyComponent {
    @Input()
    public value!: number;
}
