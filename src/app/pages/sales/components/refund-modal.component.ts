import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { InputSelect, InputSelectOption } from "../../../commons/input/models/input-select";
import { Input as InputModel } from "../../../commons/input/models/input";
import { ModalComponent } from "../../../commons/modal/modal.component";
import { ModalBodyDirective } from "../../../commons/modal/directives/modal-body.directive";
import { IModalComponent } from "../../../commons/modal/models/modal";
import { IProductRefundOptions } from "../models/product-refund-options";
import { ButtonComponent } from "../../../commons/button/button.component";
import { Button } from "../../../commons/button/models/button";
import { SalesService } from "../services/sales.service";
import { ModalService } from "../../../commons/modal/services/modal.service";
import { InputComponent } from "../../../commons/input/input.component";
import { InputSelectComponent } from "../../../commons/input/input-select.component";
import { DialogService } from "../../../commons/dialog/services/dialog.service";

@Component({
    selector: 'moneywise-app-refund',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputComponent,
        InputSelectComponent,
        ModalComponent,
        ButtonComponent,
        ModalBodyDirective
    ],
    template: `
        <moneywise-app-modal>
            <ng-container ngProjectAs="modal-header">
                Devolver produtos da venda
            </ng-container>

            <ng-template moneywiseAppModalBody>
                <div class="refund">
                    <form [formGroup]="formGroup" class="form">
                        <moneywise-app-input-select 
                            (change)="selectProduct($event)" 
                            [input]="productsRefundInput" />
                        
                        <moneywise-app-input 
                            [input]="productsRefundQtyInput" />
                    </form>
                </div>
            </ng-template>

            <ng-container ngProjectAs="modal-footer">
                <moneywise-app-button right [button]="refundButton" />
            </ng-container>
        </moneywise-app-modal>
    `
})
export class RefundModalComponent implements IModalComponent<IProductRefundOptions>, OnInit {
    @Input({
        required: true
    })
    public input: IProductRefundOptions = {
        saleId: 0,
        products: []
    };

    public refundButton: Button = new Button(
        this.refund.bind(this),
        'Salvar'
    );  

    public formGroup = this.formBuilder.group({
        productsRefund: this.formBuilder.control('', [Validators.required]),
        productsRefundQty: this.formBuilder.control({ value: null, disabled: true }, [Validators.required, Validators.min(1)])
    });

    public productsRefundInput: InputSelect<InputSelectOption> = new InputSelect(
        'products-refund',
        this.formGroup.controls.productsRefund,
        'Selecione o produto a ser devolvido',
        [],
        true
    );

    public productsRefundQtyInput: InputModel = new InputModel(
        'products-refund-qty',
        'number',
        this.formGroup.controls.productsRefundQty,
        'Quantidade',
        undefined,
        false,
        false,
        false,
        'Selecione primeiro o produto');

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly salesService: SalesService,
        private readonly modalService: ModalService,
        private readonly dialogService: DialogService
    ) { }

    public ngOnInit(): void {
        this.productsRefundInput.addRange(this.input.products);
    }

    public selectProduct(event: Event) {
        const value = (event.target as any).value;

        const product = this.input.products.find(p => p.value == value);

        this.formGroup.controls.productsRefundQty.addValidators([Validators.max(product?.quantity ?? 1)]);
        this.formGroup.controls.productsRefundQty.enable();
        this.productsRefundQtyInput.clearTitle();
    }

    private async refund() {
        const confirm = await this.dialogService.open(
            { 
                title: 'Tem certeza que deseja continuar?', 
                content: 'Essa ação não pode ser desfeita posteriormente'
            });

        debugger;
        if (!confirm) {
            return;
        }

        this.salesService.refund(this.input.saleId, [
            { 
                name: this.formGroup.controls.productsRefund.value ?? '', 
                qty: this.formGroup.controls.productsRefundQty.value ?? 0 
            }
        ]);
        
        this.modalService.close();
    }
}