import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { InputSelect, InputSelectOption } from "../../../commons/input/models/input-select";
import { InputSelectComponent } from "../../../commons/input/input-select.component";
import { InputComponent } from "../../../commons/input/input.component";
import { InputCurrency } from "../../../commons/input/models/input-currency";
import { FormCurrencyControl } from "../../../commons/controls/form-currency-control";
import { FormBuilder } from "../../../commons/builders/form.builder";
import { IFormComponent } from "../../../commons/forms/models/form";
import { ISalePayment, SalesService } from "../services/sales.service";

@Component({
    selector: 'moneywise-app-payment-form',
    standalone: true,
    imports: [
        CommonModule,
        InputSelectComponent,
        InputComponent,
        ReactiveFormsModule
    ],
    template: `
        <form class="form" [formGroup]="formGroup">
            <moneywise-app-input-select [formGroup]="formGroup" [input]="paymentMethodInput" />
            <moneywise-app-input-select [formGroup]="formGroup" [input]="paymentStateInput" />
            <moneywise-app-input [formGroup]="formGroup" [input]="valueInput" />
        </form>
    `
})
export class PaymentFormComponent implements IFormComponent {
    public name: string = 'payment';
    public title: string = 'Pagamento';

    public formGroup = this.formBuilder.group({
        method: this.formBuilder.control('', [Validators.required]),
        state: this.formBuilder.control('', [Validators.required]),
        value: this.formBuilder.currencyControl('', [Validators.required])
    });

    public get methodControl(): FormControl {
        return this.formGroup.get('method') as FormControl;
    }

    public get stateControl(): FormControl {
        return this.formGroup.get('state') as FormControl;
    }

    public get valueControl(): FormCurrencyControl {
        return this.formGroup.get('value') as FormCurrencyControl;
    }

    public paymentMethodInput: InputSelect<InputSelectOption> = new InputSelect(
        'payment-method',
        this.formGroup.controls.method,
        'Método de Pagamento',
        [
            {
                name: 'PIX',
                value: 'PIX'
            },
            {
                name: 'Dinheiro',
                value: 'Dinheiro'
            },
            {
                name: 'Cartão 2X',
                value: 'Cartão 2X'
            }
        ],
        true);

    public paymentStateInput: InputSelect<InputSelectOption> = new InputSelect(
        'payment-state',
        this.formGroup.controls.state,
        'Status de Pagamento',
        [
            {
                name: 'Pago',
                value: 'Pago'
            },
            {
                name: 'Aguardando Pagamento',
                value: 'Aguardando Pagamento'
            }
        ]);

    public valueInput: InputCurrency = new InputCurrency(
        'payment-value',
        this.formGroup.controls.value,
        'Valor'
    );

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly salesService: SalesService
    ) { }

    public async onSave() {
        const payment: ISalePayment = {
            paymentMethod: this.methodControl.value,
            paymentValue: this.valueControl.getCurrentValue(),
            state: this.stateControl.value
        };

        await this.salesService.createPayment(payment);
    }
}
