import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    selector: 'moneywise-app-quantity',
    standalone: true,
    imports: [
        CommonModule
    ],
    template: `
        <p>{{ quantity }} {{ measurementDescription }}</p>
    `
})
export class QuantityComponent {
    @Input()
    public quantity: number = 0;

    public get measurementDescription(): string {
        return this.quantity > 1 ? "UNIDs" : "UNID"
    }
}