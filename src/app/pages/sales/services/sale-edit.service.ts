import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ModalService } from "../../../commons/modal/services/modal.service";
import { SaleCreationModalComponent } from "../components/sale-creation-modal.component";

@Injectable({
    providedIn: 'root'
})
export class SaleEditService {
    private readonly $edit: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    constructor(
        private readonly modalService: ModalService
    ) {}

    public async edit(id: number) {
        this.$edit.next(id);
        await this.modalService.open(SaleCreationModalComponent, {});
    }

    public onEdit(): Observable<number> {
        return this.$edit;
    }
}