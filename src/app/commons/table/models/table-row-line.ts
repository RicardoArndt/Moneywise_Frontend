import { TableColumn } from "./table-column";


export class TableRowLine {
    constructor(
        public readonly id: number,
        public readonly columns: TableColumn[],
        public readonly isTotal: boolean = false
    ) { }
}
