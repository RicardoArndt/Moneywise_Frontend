export class TableColumn {
    public readonly component: any | null = null;
    public readonly inputs: any | null = null;

    constructor(
        public readonly id: number,
        public readonly value: string
    ) { }
}
