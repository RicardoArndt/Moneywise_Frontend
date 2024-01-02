import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: '[moneywiseAppModalBody]',
    standalone: true
})
export class ModalBodyDirective {
    constructor(public templateRef: TemplateRef<unknown>) {}
}