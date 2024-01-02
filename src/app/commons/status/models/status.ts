export enum StatusType {
    success = 'success',
    danger = 'danger',
    warning = 'warning'
}

export class Status {
    public constructor(
        public readonly description: string,
        public readonly type: StatusType
    ) { }
}