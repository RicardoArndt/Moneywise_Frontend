import { Button } from "../../button/models/button";
import { TableActionsComponent } from "../components/table-actions.component";
import { TableColumn } from "./table-column";


export class TableColumnActions extends TableColumn {
    public override readonly component = TableActionsComponent;

    constructor(
        public override readonly id: number,
        public override readonly inputs: {actionButtons: Button[]}
    ) { super(id, ''); }
}
