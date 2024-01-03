import { QuantityComponent } from "../../quantity/quantity.component";
import { TableColumn } from "./table-column";

export class TableColumnQuantity extends TableColumn {
    public override component: any = QuantityComponent;

    constructor(
        public override readonly id: number,
        public override readonly inputs: {quantity: number},
        public override readonly label: string = '',
    ) { super(id, '', label); }
}
