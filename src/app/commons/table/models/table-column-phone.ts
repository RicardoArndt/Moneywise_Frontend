import { PhoneComponent } from "../../phone/phone.component";
import { TableColumn } from "./table-column";

export class TableColumnPhone extends TableColumn {
    public override component: any = PhoneComponent;

    constructor(
        public override readonly id: number,
        public override readonly inputs: {phone: string, copy: boolean}
    ) { super(id, ''); }
}
