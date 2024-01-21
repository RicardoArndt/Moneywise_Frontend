import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { IDialog } from "../models/dialog";
import { ModalService } from "../../modal/services/modal.service";
import { DialogComponent } from "../dialog.component";

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    private readonly $confirm: BehaviorSubject<number> = new BehaviorSubject(0);

    constructor (
        private readonly modalService: ModalService
    ) { }

    public async open(input: IDialog) {
        await this.modalService.open(DialogComponent, input);
        
        if (this.$confirm.value) {
            return true;
        }

        return false;
    }

    public confirm(id: number) {
        this.$confirm.next(id);
    }

    public discard() {
        this.$confirm.next(0);
    }
}