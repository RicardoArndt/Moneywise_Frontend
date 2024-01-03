import { FormControl } from "@angular/forms";

export class FormCurrencyControl extends FormControl {
    public getCurrentValue(): number {
        const currentValue = this.value.toString();
        return parseFloat((+currentValue.replace(',', '.').replace('R$ ', '')!).toFixed(2));
    }
}