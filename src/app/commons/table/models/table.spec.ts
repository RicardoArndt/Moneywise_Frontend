import { Table } from "./table";
import { TableHeadColumn } from "./table-head-column";
import { TableHeadLine } from "./table-head-line";
import { TableColumn } from "./table-column";
import { TableRowLine } from "./table-row-line";

describe('Table', () => {
    describe('addHead', () => {
        it('should not duplicate head', () => {
            const table = new Table([
                new TableHeadLine(1, [])
            ]);

            try {
                table.addHead(new TableHeadLine(1, []));
            } catch (ex) {
                expect((ex as Error).message).toBe("Head already exists");
            }
        });

        it('should add head', () => {
            const table = new Table();

            table.addHead(new TableHeadLine(1, []));

            expect(table.getHead().length).toBe(1);
            expect(table.getHead()[0].id).toBe(1);
        });

        it('should add in position 2', () => {
            const table = new Table([
                new TableHeadLine(1, []),
                new TableHeadLine(2, []),
                new TableHeadLine(3, [])
            ]);

            table.addHead(new TableHeadLine(4, []), 2);

            expect(table.getHead().length).toBe(4);

            expect(table.getHead()[0].id).toBe(1);
            
            expect(table.getHead()[1].id).toBe(4);

            expect(table.getHead()[2].id).toBe(2);
            expect(table.getHead()[3].id).toBe(3);
        });

        it('should add in position 3', () => {
            const table = new Table([
                new TableHeadLine(1, []),
                new TableHeadLine(2, []),
                new TableHeadLine(3, [])
            ]);

            table.addHead(new TableHeadLine(4, []), 3);

            expect(table.getHead().length).toBe(4);

            expect(table.getHead()[0].id).toBe(1);
            
            expect(table.getHead()[1].id).toBe(2);

            expect(table.getHead()[2].id).toBe(4);
            expect(table.getHead()[3].id).toBe(3);
        });

        it('should add in position 4', () => {
            const table = new Table([
                new TableHeadLine(1, []),
                new TableHeadLine(2, []),
                new TableHeadLine(3, [])
            ]);

            table.addHead(new TableHeadLine(4, []), 4);

            expect(table.getHead().length).toBe(4);

            expect(table.getHead()[0].id).toBe(1);
            
            expect(table.getHead()[1].id).toBe(2);

            expect(table.getHead()[2].id).toBe(3);
            expect(table.getHead()[3].id).toBe(4);
        });

        it('should add in first', () => {
            const table = new Table([
                new TableHeadLine(1, []),
                new TableHeadLine(2, []),
                new TableHeadLine(3, [])
            ]);

            table.addHead(new TableHeadLine(4, []), 1);

            expect(table.getHead().length).toBe(4);

            expect(table.getHead()[0].id).toBe(4);
            
            expect(table.getHead()[1].id).toBe(1);

            expect(table.getHead()[2].id).toBe(2);
            expect(table.getHead()[3].id).toBe(3);
        });
    });

    describe('addRow', () => {
        it('should not duplicate row', () => {
            const table = new Table(
                [],
                [
                    new TableRowLine(1, [])
                ]);

            try {
                table.addRow(new TableRowLine(1, []));
            } catch (ex) {
                expect((ex as Error).message).toBe("Row already exists");
            }
        });

        it('should add row', () => {
            const table = new Table();

            table.addRow(new TableRowLine(1, []));

            expect(table.getRows().length).toBe(1);
            expect(table.getRows()[0].id).toBe(1);
        });

        it('should add in position 2', () => {
            const table = new Table(
                [],
                [
                    new TableRowLine(1, []),
                    new TableRowLine(2, []),
                    new TableRowLine(3, [])
                ]);

            table.addRow(new TableRowLine(4, []), 2);

            expect(table.getRows().length).toBe(4);

            expect(table.getRows()[0].id).toBe(1);
            
            expect(table.getRows()[1].id).toBe(4);

            expect(table.getRows()[2].id).toBe(2);
            expect(table.getRows()[3].id).toBe(3);
        });

        it('should add in position 3', () => {
            const table = new Table(
                [],
                [
                    new TableRowLine(1, []),
                    new TableRowLine(2, []),
                    new TableRowLine(3, [])
                ]);

            table.addRow(new TableRowLine(4, []), 3);

            expect(table.getRows().length).toBe(4);

            expect(table.getRows()[0].id).toBe(1);
            
            expect(table.getRows()[1].id).toBe(2);

            expect(table.getRows()[2].id).toBe(4);
            expect(table.getRows()[3].id).toBe(3);
        });

        it('should add in position 4', () => {
            const table = new Table(
                [],
                [
                    new TableRowLine(1, []),
                    new TableRowLine(2, []),
                    new TableRowLine(3, [])
                ]);

            table.addRow(new TableRowLine(4, []), 4);

            expect(table.getRows().length).toBe(4);

            expect(table.getRows()[0].id).toBe(1);
            
            expect(table.getRows()[1].id).toBe(2);

            expect(table.getRows()[2].id).toBe(3);
            expect(table.getRows()[3].id).toBe(4);
        });

        it('should add in first', () => {
            const table = new Table(
                [],
                [
                    new TableRowLine(1, []),
                    new TableRowLine(2, []),
                    new TableRowLine(3, [])
                ]);

            table.addRow(new TableRowLine(4, []), 1);

            expect(table.getRows().length).toBe(4);

            expect(table.getRows()[0].id).toBe(4);
            
            expect(table.getRows()[1].id).toBe(1);

            expect(table.getRows()[2].id).toBe(2);
            expect(table.getRows()[3].id).toBe(3);
        });
    });

    describe('addColumn', () => {
        it('should add column', () => {
            const table = new Table(
                [new TableHeadLine(1, [new TableHeadColumn(1, "1"), new TableHeadColumn(2, "2")])],
                [new TableRowLine(1, [new TableColumn(1, "1"), new TableColumn(2, "2")])],
            );

            table.addColumn(new TableColumn(3, "1"));

            expect(table.getRows()[0].columns.length).toBe(3);
            expect(table.getRows()[0].columns[2].id).toBe(3);

            expect(table.getHead()[0].columns.length).toBe(3);
            expect(table.getHead()[0].columns[2].id).toBe(3);
        });

        it('should add in position 2', () => {
            const table = new Table(
                [new TableHeadLine(1, [new TableHeadColumn(1, "1"), new TableHeadColumn(2, "2")])],
                [new TableRowLine(1, [new TableColumn(1, "1"), new TableColumn(2, "2")])],
            );

            table.addColumn(new TableColumn(3, "1"), 2);

            expect(table.getRows()[0].columns.length).toBe(3);
            expect(table.getRows()[0].columns[1].id).toBe(3);
            expect(table.getRows()[0].columns[2].id).toBe(2);

            expect(table.getHead()[0].columns.length).toBe(3);
            expect(table.getHead()[0].columns[1].id).toBe(3);
            expect(table.getHead()[0].columns[2].id).toBe(2);
        });

        it('should add in last', () => {
            const table = new Table(
                [new TableHeadLine(1, [new TableHeadColumn(1, "1"), new TableHeadColumn(2, "2")])],
                [new TableRowLine(1, [new TableColumn(1, "1"), new TableColumn(2, "2")])],
            );

            table.addColumn(new TableColumn(3, "1"), 3);

            expect(table.getRows()[0].columns.length).toBe(3);
            expect(table.getRows()[0].columns[1].id).toBe(2);
            expect(table.getRows()[0].columns[2].id).toBe(3);

            expect(table.getHead()[0].columns.length).toBe(3);
            expect(table.getHead()[0].columns[1].id).toBe(2);
            expect(table.getHead()[0].columns[2].id).toBe(3);
        });

        it('should add in first', () => {
            const table = new Table(
                [new TableHeadLine(1, [new TableHeadColumn(1, "1"), new TableHeadColumn(2, "2")])],
                [new TableRowLine(1, [new TableColumn(1, "1"), new TableColumn(2, "2")])],
            );

            table.addColumn(new TableColumn(3, "1"), 1);

            expect(table.getRows()[0].columns.length).toBe(3);
            expect(table.getRows()[0].columns[0].id).toBe(3);
            expect(table.getRows()[0].columns[1].id).toBe(1);
            expect(table.getRows()[0].columns[2].id).toBe(2);

            expect(table.getHead()[0].columns.length).toBe(3);
            expect(table.getHead()[0].columns[0].id).toBe(3);
            expect(table.getHead()[0].columns[1].id).toBe(1);
            expect(table.getHead()[0].columns[2].id).toBe(2);
        });
    });
});
