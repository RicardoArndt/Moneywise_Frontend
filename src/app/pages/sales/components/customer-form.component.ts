import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";

import { InputComponent } from "../../../commons/input/input.component";
import { Input as InputModel } from '../../../commons/input/models/input';
import { InputPhone } from "../../../commons/input/models/input-phone";
import { FormOnlyDigitsControl } from "../../../commons/controls/form-only-digits-control";
import { onlyDigits } from "../../../commons/controls/validators/max-length-only-digits.directive";
import { FormBuilder } from "../../../commons/builders/form.builder";
import { IFormComponent } from "../../../commons/forms/models/form";
import { ISaleCustomer, SalesService } from "../services/sales.service";

@Component({
    selector: 'moneywise-app-customer-form',
    standalone: true,
    imports: [
        CommonModule,
        InputComponent,
        ReactiveFormsModule
    ],
    template: `
        <form class="form" [formGroup]="formGroup">
            <moneywise-app-input [formGroup]="formGroup" [input]="customerNameInput" />
            <moneywise-app-input [formGroup]="formGroup" [input]="customerContactInput" />
        </form>
    `
})
export class CustomerFormComponent implements IFormComponent {
    public name: string = 'customer';
    public title: string = 'Cliente'; 

    public formGroup = this.formBuilder.group({
        name: this.formBuilder.control(null, [Validators.required]),
        contact: this.formBuilder.onlyDigitsControl(
            null, 
            [
                Validators.required, 
                Validators.minLength(11), 
                onlyDigits(11)
            ])
    });

    public get nameControl(): FormControl {
        return this.formGroup.get('name') as FormControl;
    }

    public get contactControl(): FormOnlyDigitsControl {
        return this.formGroup.get('contact') as FormOnlyDigitsControl;
    }

    public customerNameInput: InputModel = new InputModel(
        'customer-name', 
        'text',
        this.formGroup.controls.name,
        'Nome', 
        'name',
        true);

    public customerContactInput: InputPhone = new InputPhone(
        'customer-contact',
        this.formGroup.controls.contact,
        'Contato',
        false);

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly salesService: SalesService
    ) { }

    public async onSave() {
        const customer: ISaleCustomer = {
            customerContact: this.contactControl.getCurrentValue(),
            customerName: this.nameControl.value
        };

        await this.salesService.createCustomer(customer);
    }
}
