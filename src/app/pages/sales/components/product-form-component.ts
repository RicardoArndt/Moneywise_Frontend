import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { 
    FormArray,
    FormControl, 
    FormGroup, 
    ReactiveFormsModule, 
    Validators 
} from "@angular/forms";
import { faAdd, faMinus } from "@fortawesome/free-solid-svg-icons";
import { filter, mergeMap, tap } from "rxjs";

import { InputComponent } from "../../../commons/input/input.component";
import { Input as InputModel } from '../../../commons/input/models/input';
import { ButtonComponent } from "../../../commons/button/button.component";
import { Button } from "../../../commons/button/models/button";
import { IFormComponent } from "../../../commons/forms/models/form";
import { SalesService } from "../services/sales.service";
import { SaleEditService } from "../services/sale-edit.service";
import { ISaleProduct } from "../models/sale-product";
import { InputCurrency } from "../../../commons/input/models/input-currency";
import { FormCurrencyControl } from "../../../commons/controls/form-currency-control";
import { FormBuilder } from "../../../commons/builders/form.builder";

@Component({
    selector: 'moneywise-app-product-form',
    standalone: true,
    imports: [
        CommonModule,
        InputComponent,
        ButtonComponent,
        ReactiveFormsModule
    ],
    template: `
        <form class="form" [formGroup]="formGroup">
            @for (product of productsGroup; track i; let i = $index) {
                <div class="form__group">
                    <label>Produto {{ i + 1 }}</label>
                    <moneywise-app-input [input]="getProductNameInput(product, i)" />
                    <moneywise-app-input [input]="getProductQuantityInput(product, i)" />
                    <moneywise-app-input [input]="getProductValueInput(product, i)" />
                </div>
            }
        </form>

        <div class="action-buttons">
            <moneywise-app-button right [button]="removeProductButton" [disabled]="productsForm.length == 1" />
            <moneywise-app-button right [button]="addProductButton" />
        </div>
    `
})
export class ProductFormComponent implements IFormComponent, OnInit {
    public isEdit: boolean = false;
    public saleId: number = 0;
    public name: string = 'product';
    public title: string = 'Produtos';

    public formGroup = this.formBuilder.group({
        products: this.formBuilder.array([
            this.formBuilder.group({ 
                name: this.formBuilder.control('', [Validators.required]),
                quantity: this.formBuilder.control(null, [Validators.required]),
                value: this.formBuilder.currencyControl(null, [Validators.required])
            })
        ])
    });

    public get productsControls(): { name: FormControl, quantity: FormControl, value: FormCurrencyControl }[] {
        return this.productsForm.controls.map(control => {
            const formGroup = control as FormGroup;

            return { 
                name: formGroup.get('name') as FormControl,
                quantity: formGroup.get('quantity') as FormControl,
                value: formGroup.get('value') as FormCurrencyControl
            };
        });
    }

    public addProductButton = new Button(this.addProductForm.bind(this), '', faAdd);
    public removeProductButton = new Button(this.removeProductForm.bind(this), '', faMinus);

    public get productsGroup() {
        return this.productsForm.controls as FormGroup[];
    }

    public get productsForm() {
        return this.formGroup.get('products') as FormArray;
    }

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly salesService: SalesService,
        private readonly saleEditService: SaleEditService,
    ) { }

    public ngOnInit(): void {
        this.saleEditService.onEdit()
            .pipe(
                tap(id => this.isEdit = !!id),
                tap(id => this.saleId = id),
                mergeMap(id => this.salesService.readProducts(id)),
                filter(products => !!products.length))
            .subscribe((products: ISaleProduct[]) => {
                this.productsForm.removeAt(0);

                for (const product of products) {
                    this.productsForm.push(
                        this.formBuilder.group({ 
                            name: this.formBuilder.control(product.name, [Validators.required]),
                            quantity: this.formBuilder.control(product.quantity, [Validators.required]),
                            value: this.formBuilder.currencyControl(product.value, [Validators.required])
                        }));
                }
            });
    }

    public getProductNameInput(formGroup: FormGroup, index: number): InputModel {
        const control = formGroup.get('name') as FormControl;
        
        return new InputModel(
            `product-name-${index}`,
            'text',
            control,
            'Nome',
            'name',
            true);
    };

    public getProductQuantityInput(formGroup: FormGroup, index: number): InputModel {
        const control = formGroup.get('quantity') as FormControl;

        return new InputModel(
            `product-qty-${index}`,
            'number',
            control,
            'Quantidade');
    };

    public getProductValueInput(formGroup: FormGroup, index: number): InputCurrency {
        const control = formGroup.get('value') as FormControl;

        return new InputCurrency(
            `product-value-${index}`,
            control,
            'Valor');
    }

    public addProductForm() {
        this.productsForm.push(
            this.formBuilder.group({ 
                name: this.formBuilder.control('', [Validators.required]),
                quantity: this.formBuilder.control(null, [Validators.required]),
                value: this.formBuilder.currencyControl(null, [Validators.required])
            }));
    }

    public removeProductForm() {
        if (this.productsForm.length == 1) {
            return;
        }

        this.productsForm.removeAt(this.productsForm.length - 1);
    }

    public async onSave() {
        const products: ISaleProduct[] = this.productsControls.map(control => {
            return {
              name: control.name.value,
              quantity: control.quantity.value,
              value: control.value.getCurrentValue()
            }
          }
        );

        for (const product of products) {
            await this.salesService.createProduct(product);
        }
    }

    public async onEdit() {
        const products: ISaleProduct[] = this.productsControls.map(control => {
            return {
              name: control.name.value,
              quantity: control.quantity.value,
              value: control.value.getCurrentValue()
            }
          }
        );

        for (const product of products) {
            await this.salesService.updateProduct(this.saleId, product);
        }
    }
}
