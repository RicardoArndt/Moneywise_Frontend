import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function onlyDigits(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const valueOnlyDigits = control.value?.toString()?.replace(/\D/g, '') ?? '';
        
        if (valueOnlyDigits.length > maxLength) {
            return { maxlength: { requiredLength: maxLength, actualLength: valueOnlyDigits.length } }
        }

        return null;
    };
}