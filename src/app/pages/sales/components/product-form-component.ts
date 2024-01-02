import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { 
    FormArray, 
    FormBuilder, 
    FormControl, 
    FormGroup, 
    ReactiveFormsModule, 
    Validators 
} from "@angular/forms";
import { faAdd, faMinus } from "@fortawesome/free-solid-svg-icons";

import { InputComponent } from "../../../commons/input/input.component";
import { Input as InputModel } from '../../../commons/input/models/input';
import { ButtonComponent } from "../../../commons/button/button.component";
import { Button } from "../../../commons/button/models/button";
import { IFormComponent } from "../../../commons/forms/models/form";
import { ISaleProduct, SalesService } from "../services/sales.service";

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
        <moneywise-app-form class="form" [formGroup]="formGroup">
            <div class="form__group" *ngFor="let product of productsGroup; index as i">
                <label>Produto {{ i + 1 }}</label>
                <moneywise-app-input [input]="getProductNameInput(product, i)" />
                <moneywise-app-input [input]="getProductQuantityInput(product, i)" />
            </div>
        </moneywise-app-form>

        <div class="action-buttons">
            <moneywise-app-button right [button]="removeProductButton" [disabled]="productsForm.length == 1" />
            <moneywise-app-button right [button]="addProductButton" />
        </div>
    `
})
export class ProductFormComponent implements IFormComponent {
    public name: string = 'product';
    public title: string = 'Produtos';

    public formGroup = this.formBuilder.group({
        products: this.formBuilder.array([
            this.formBuilder.group({ 
                name: this.formBuilder.control('', [Validators.required]),
                quantity: this.formBuilder.control('', [Validators.required]) 
            })
        ])
    });

    public get productsControls(): { name: FormControl, quantity: FormControl }[] {
        return this.productsForm.controls.map(control => {
            const formGroup = control as FormGroup;

            return { 
                name: formGroup.get('name') as FormControl,
                quantity: formGroup.get('quantity') as FormControl
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
        private readonly salesService: SalesService
    ) { }

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
            'Quantidade',
            'qty');
    };

    public addProductForm() {
        this.productsForm.push(
            this.formBuilder.group({ 
                name: this.formBuilder.control('', [Validators.required]),
                quantity: this.formBuilder.control('', [Validators.required]) 
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
              quantity: control.quantity.value
            }
          }
        );

        for (const product of products) {
            await this.salesService.createProduct(product);
        }
    }
}
