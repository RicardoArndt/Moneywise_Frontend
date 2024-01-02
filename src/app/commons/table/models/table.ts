import { TableHeadLine } from "./table-head-line";
import { TableColumn } from "./table-column";
import { TableRowLine } from "./table-row-line";

export class Table {
    private readonly _head: TableHeadLine[] = [];
    private readonly _rows: TableRowLine[] = [];

    constructor(
        head: TableHeadLine[] = [],
        rows: TableRowLine[] = []
    ) { 
        for (const h of head) {
            this.addHead(h);
        }

        for (const r of rows) {
            this.addRow(r);
        }
    }

    public addHead(head: TableHeadLine, position?: number) {
        if (this._head.findIndex(r => r.id === head.id) > -1) {
            throw new Error('Head already exists');
        }

        this.addElementIn(this._head, head, position);
    }

    public getHead() {
        return [...this._head];
    }

    public addRow(row: TableRowLine, position?: number) {
        if (this._rows.findIndex(r => r.id === row.id) > -1) {
            throw new Error('Row already exists');
        }

        this.addElementIn(this._rows, row, position);
    }

    public addColumn(column: TableColumn, position?: number) {
        for (const r of this._rows) {
            this.addElementIn(r.columns, column, position);
        }
        
        for (const h of this._head) {
            this.addElementIn(h.columns, column, position);
        }
    }

    public addLast(column: TableColumn) {
        for (const r of this._rows) {
            this.addElementIn(r.columns, column, r.columns.length);
        }
        
        for (const h of this._head) {
            this.addElementIn(h.columns, column, h.columns.length);
        }
    }

    public getRows() {
        return [...this._rows];
    }

    private addElementIn(list: any[], element: any, position?: number) {
        if (position) {
            this.addElementInPosition(list, element, position);

            return;
        }

        list.push(element);
    }

    private addElementInPosition(list: any[], element: any, position: number) {
        const afterPosition = list.slice(position - 1, list.length);

        list.splice(position - 1, list.length);
        list.push(element);

        for (const r of afterPosition) {
            list.push(r);
        }
    }
}
