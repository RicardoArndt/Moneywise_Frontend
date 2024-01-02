import { Injectable } from "@angular/core";
import {
    FormBuilder as BaseFormBuilder, 
    FormControl, 
    FormControlOptions, 
    ValidatorFn 
} from "@angular/forms"; 

import { FormOnlyDigitsControl } from "../controls/form-only-digits-control";
import { FormCurrencyControl } from "../controls/form-currency-control";

@Injectable({
    providedIn: 'root'
})
export class FormBuilder extends BaseFormBuilder {
    public onlyDigitsControl(value: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null): FormOnlyDigitsControl {
        return new FormOnlyDigitsControl(value, validatorOrOpts);
    }

    public currencyControl(value: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null): FormCurrencyControl {
        return new FormCurrencyControl(value, validatorOrOpts);
    }
}