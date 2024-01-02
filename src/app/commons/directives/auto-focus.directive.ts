import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[moneywiseAppAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit {
  @Input() 
  public moneywiseAppAutoFocus: boolean = false;
  
  constructor(private el: ElementRef) { }

  public ngAfterViewInit() {
    if (!this.moneywiseAppAutoFocus) {
      return;
    }

    this.el.nativeElement.focus();
  }
}
