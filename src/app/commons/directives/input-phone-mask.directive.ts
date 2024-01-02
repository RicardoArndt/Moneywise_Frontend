import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[moneywiseAppInputPhoneMask]',
  standalone: true
})
export class InputMaskPhoneDirective {
  @Input() 
  public moneywiseAppInputPhoneMask: boolean = false;
  
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  public onInput(event: any) {
    if (!this.moneywiseAppInputPhoneMask) {
        return;
    }

    let inputValue: string = event.target?.value;
    inputValue = inputValue
        .replace(/\D/g, '');

    if (inputValue.length == 11) {
        inputValue = inputValue.replace(/^(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4})$/, '($1) $2 $3-$4');
        this.el.nativeElement.value = inputValue;
    } else if (inputValue.length > 11) {
        this.el.nativeElement.value = inputValue
            .slice(0, 11)
            .replace(/^(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4})$/, '($1) $2 $3-$4');
    } else {
        this.el.nativeElement.value = inputValue.replace(/\D/g, '');
    }
  }
}
