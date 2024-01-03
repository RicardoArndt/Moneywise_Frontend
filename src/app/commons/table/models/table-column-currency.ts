import { CurrencyComponent } from "../../currency/currency.component";
import { TableColumn } from "./table-column";

export class TableColumnCurrency extends TableColumn {
    public override readonly component = CurrencyComponent;

    constructor(
        public override readonly id: number,
        public override readonly inputs: {value: number},
        public override readonly label: string = '',
    ) { super(id, '', label); }
}
