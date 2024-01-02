import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class OpenCloseService {
    private readonly isOpened: BehaviorSubject<boolean> = new BehaviorSubject(false);
    
    open() {
        this.isOpened.next(true);
    }

    close() {
        this.isOpened.next(false);
    }

    getIsOpened(): Observable<boolean> {
        return this.isOpened;
    }
}