import { FormControl } from "@angular/forms";

export class FormOnlyDigitsControl extends FormControl {
    public getCurrentValue(): string {
        return this.value.replace(/\D/g, '');
    }
}