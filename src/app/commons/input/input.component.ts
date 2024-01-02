import { Component, Input, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Input as InputModel } from './models/input';
import { AutoFocusDirective } from '../directives/auto-focus.directive';
import { InputMaskPhoneDirective } from '../directives/input-phone-mask.directive';
import { InputMaskCurrencyDirective } from '../directives/input-currency-mask.directive';
import { FormService } from '../services/form.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'moneywise-app-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoFocusDirective,
    InputMaskPhoneDirective,
    InputMaskCurrencyDirective
  ],
  template: `
    <div class="input" *ngIf="input">
        <label class="input__label" [for]="input.id">{{ input.label }}</label>
        <input 
            class="input__control"
            [ngClass]="{'input__control--invalid': input.control.errors && (input.control.touched || submitted())}"
            [moneywiseAppInputPhoneMask]="input.usePhoneMask"
            [moneywiseAppInputCurrencyMask]="input.useCurrencyMask"
            [id]="input.id"
            [moneywiseAppAutoFocus]="input.autoFocus"
            [type]="input.type" 
            [autocomplete]="input.autocomplete" 
            [formControl]="input.control" />
          <div class="input__errors">
            @for (errorMessage of input.getErrorsMessage(submitted()); track errorMessage) {
              <p>{{ errorMessage }}</p>
            }
          </div>
    </div>
  `
})
export class InputComponent {
    @Input({
      required: true
    })
    public input!: InputModel;

    public readonly submitted!: Signal<boolean>;

    public get errors(): string[] {
      return Object.keys(this.input.control.errors as object);
    }

    public constructor(
      private readonly formService: FormService
    ) { 
      this.submitted = toSignal(this.formService.isSubmitted(), { initialValue: false });
    }
}
