import { TableHeadColumn } from "./table-head-column";


export class TableHeadLine {
    constructor(
        public readonly id: number,
        public readonly columns: TableHeadColumn[]
    ) { }
}
