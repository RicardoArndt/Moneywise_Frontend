import { Component, Input, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from './models/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'moneywise-app-button',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  template: `
    <div 
      class="btn__container" 
      [ngClass]="{'btn__container--right': right, 'btn__container--left': left}">
      <button class="btn btn__responsive btn__{{button.type}} btn--no-border" [disabled]="disabled" (click)="button.action()">
        @if (button.icon) {
          <fa-icon [icon]="button.icon"></fa-icon>
        }
        {{ button.title }}
      </button>
    </div>
  `
})
export class ButtonComponent {
  @Input({
    transform: booleanAttribute
  }) 
  public right: boolean = false;

  @Input({
    transform: booleanAttribute
  }) 
  public left: boolean = false;
  
  @Input() 
  public button: Button = new Button(() => {});

  @Input()
  public disabled: boolean = false;
}
