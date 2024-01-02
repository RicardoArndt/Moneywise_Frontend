import { Status, StatusType } from "../../../commons/status/models/status";

export class SalesStatus {
    public readonly status: Status; 

    constructor(
        public readonly description: string
    ) { 
        this.status = this.getStatus(description);
    }

    private getStatus(description: string): Status {
        switch(description.toLowerCase()) {
            case ('pago'):
                return new Status(description, StatusType.success);
            case ('devolvido'):
                return new Status(description, StatusType.warning);
            default:
                return new Status(description, StatusType.danger);
        }
    }
}