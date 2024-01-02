import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[moneywiseAppInputCurrencyMask]',
  standalone: true
})
export class InputMaskCurrencyDirective {
  @Input() 
  public moneywiseAppInputCurrencyMask: boolean = false;
  
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  public onInput(event: any) {
    const currencySymbol = 'R$ ';

    if (!this.moneywiseAppInputCurrencyMask) {
        return;
    }

    let inputValue: string = event.target?.value;

    let decimal: string = '';
    let hasDecimal: boolean = false;
    if (inputValue.includes(',')) {
        hasDecimal = true;
        decimal = inputValue.split(',')[inputValue.split(',').length - 1];
    }

    decimal = decimal.replace(/\D/g, '');
    if (hasDecimal && decimal.length >= 2) {
        decimal = decimal.slice(0, 2);
        
        inputValue = inputValue
            .replace(/\D/g, '')
            .split(decimal)[0];

        this.el.nativeElement.value = `${currencySymbol}${inputValue},${decimal}`;
    } else {
        inputValue = inputValue
            .replace(/\D/g, '');

        if (hasDecimal && decimal.length == 2) {
            inputValue = inputValue.slice(0, inputValue.length - 2);
        }

        if (hasDecimal && decimal.length == 1) {
            inputValue = inputValue.slice(0, inputValue.length - 1);
        }

        const parts = inputValue.split('.');
        const money = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

        let formattedValue = `${currencySymbol}${money}`;
        if (hasDecimal) {
            formattedValue = `${currencySymbol}${money},${decimal}`;
        }

        this.el.nativeElement.value = formattedValue;
    }
  }
}
