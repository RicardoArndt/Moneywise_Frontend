import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private readonly isOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
     
    public open() {
        if (this.isOpen.value) {
            throw new Error('This modal already is opened');
        }

        this.isOpen.next(true);
    }

    public close() {
        if (!this.isOpen.value) {
            throw new Error('This modal already is closed');
        }

        this.isOpen.next(false);
    }

    public getIsOpen(): Observable<boolean> {
        return this.isOpen;
    }
}