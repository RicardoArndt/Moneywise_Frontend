import { Component } from "@angular/core";
import { ToastModule } from "primeng/toast";

@Component({
    selector: "moneywise-app-toast",
    standalone: true,
    template: `
        <p-toast [breakpoints]="{'920px': {width: '100%', right: '0', left: '0'}}"></p-toast>
    `,
    imports: [
        ToastModule
    ]
})
export class ToastComponent { }