import { Status } from "../../status/models/status";
import { StatusComponent } from "../../status/status.component";
import { TableColumn } from "./table-column";


export class TableColumnStatus extends TableColumn {
    public override readonly component = StatusComponent;

    constructor(
        public override readonly id: number,
        public override readonly inputs: {status: Status}
    ) { super(id, ''); }
}
