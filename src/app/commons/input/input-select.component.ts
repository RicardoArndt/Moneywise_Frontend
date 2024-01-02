import { Component, Input, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AutoFocusDirective } from '../directives/auto-focus.directive';
import { InputSelect, InputSelectOption } from './models/input-select';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormService } from '../services/form.service';

@Component({
  selector: 'moneywise-app-input-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AutoFocusDirective
  ],
  template: `
    <div class="input">
        <label class="input__label" [for]="input.id">{{ input.label }}</label>
        <select 
          class="input__control" 
          [ngClass]="{'input__control--invalid': input.control.errors && (input.control.touched || submitted())}"
          [moneywiseAppAutoFocus]="input.autoFocus" [formControl]="input.control">
            @for (opt of input.options; track opt.name) {
              <option [value]="opt.value">{{ opt.name }}</option>
            }
        </select>
        <div class="input__errors">
          @for (errorMessage of input.getErrorsMessage(submitted()); track errorMessage) {
            <p>{{ errorMessage }}</p>
          }
        </div>
    </div>
  `
})
export class InputSelectComponent {
    @Input()
    public input!: InputSelect<InputSelectOption>;

    public readonly submitted!: Signal<boolean>;

    public constructor(
      private readonly formService: FormService
    ) { 
      this.submitted = toSignal(this.formService.isSubmitted(), { initialValue: false });
    }
}
