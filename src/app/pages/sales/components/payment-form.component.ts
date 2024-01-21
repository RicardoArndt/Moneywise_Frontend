import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";

import { InputSelect, InputSelectOption } from "../../../commons/input/models/input-select";
import { InputSelectComponent } from "../../../commons/input/input-select.component";
import { InputComponent } from "../../../commons/input/input.component";
import { FormBuilder } from "../../../commons/builders/form.builder";
import { IFormComponent } from "../../../commons/forms/models/form";
import { SalesService } from "../services/sales.service";
import { ISalePayment } from "../models/sale-payment";
import { SaleEditService } from "../services/sale-edit.service";
import { mergeMap, filter, tap } from "rxjs";

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
            <moneywise-app-input-select [input]="paymentMethodInput" />
            <moneywise-app-input-select [input]="paymentStatusInput" />
        </form>
    `
})
export class PaymentFormComponent implements IFormComponent, OnInit {
    public isEdit: boolean = false;
    public saleId: number = 0;
    public name: string = 'payment';
    public title: string = 'Pagamento';

    public formGroup = this.formBuilder.group({
        method: this.formBuilder.control('', [Validators.required]),
        status: this.formBuilder.control('', [Validators.required])
    });

    public get methodControl(): FormControl {
        return this.formGroup.get('method') as FormControl;
    }

    public get statusControl(): FormControl {
        return this.formGroup.get('status') as FormControl;
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

    public paymentStatusInput: InputSelect<InputSelectOption> = new InputSelect(
        'payment-status',
        this.formGroup.controls.status,
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

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly salesService: SalesService,
        private readonly saleEditService: SaleEditService
    ) { }

    public ngOnInit(): void {
        this.saleEditService.onEdit()
            .pipe(
                tap(id => this.isEdit = !!id),
                tap(id => this.saleId = id),
                mergeMap(id => this.salesService.readPayment(id)),
                filter(payment => !!payment))
            .subscribe(payment => {
                this.methodControl.setValue(payment?.paymentMethod);
                this.statusControl.setValue(payment?.status);
            });
    }

    public async onSave() {
        const payment: ISalePayment = {
            paymentMethod: this.methodControl.value,
            status: this.statusControl.value
        };

        await this.salesService.createPayment(payment);
    }

    public async onEdit() {
        const payment: ISalePayment = {
            paymentMethod: this.methodControl.value,
            status: this.statusControl.value
        };

        await this.salesService.updatePayment(this.saleId, payment);
    }
}
