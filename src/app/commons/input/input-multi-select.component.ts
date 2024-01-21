import { CommonModule } from "@angular/common";
import { Component, Input, Signal } from "@angular/core";
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSelect, InputSelectOption } from "./models/input-select";
import { ReactiveFormsModule } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormService } from "../services/form.service";

@Component({
    selector: 'moneywise-app-input-multi-select',
    standalone: true,
    imports: [
        CommonModule,
        MultiSelectModule,
        ReactiveFormsModule
    ],
    template: `
        <div class="input">
            <label class="input__label" [for]="input.id">{{ input.label }}</label>
            <p-multiSelect
                [styleClass]="input.control.errors && (input.control.touched || submitted()) ? 'input__control input__control--invalid' : 'input__control'"
                [options]="input.options"
                [formControl]="input.control"
                optionLabel="name" 
                placeholder="Selecione os produtos">
            </p-multiSelect>

            <div class="input__errors">
                @for (errorMessage of input.getErrorsMessage(submitted()); track errorMessage) {
                    <p>{{ errorMessage }}</p>
                }
            </div>
        </div>
    `
})
export class InputMultiSelectComponent {
    @Input()
    public input!: InputSelect<InputSelectOption>;

    public readonly submitted!: Signal<boolean>;

    public constructor(
      private readonly formService: FormService
    ) { 
      this.submitted = toSignal(this.formService.isSubmitted(), { initialValue: false });
    }
}
