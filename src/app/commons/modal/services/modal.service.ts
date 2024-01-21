import { Injectable, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IModalComponent } from '../models/modal';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private readonly $modal: BehaviorSubject<{modalType: Type<any>, input: any}|null> 
        = new BehaviorSubject<{modalType: Type<any>, input: any}|null>(null);
    
    private subscription?: Subscription;

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute
    ) { }

    public open<TModal extends IModalComponent<TInput>, TInput>(modal: Type<TModal>, input: TInput|null, isQueryParams: boolean = false) {
        if (isQueryParams) {
            this.router.navigate(
                [], 
                { 
                  relativeTo: this.activatedRoute, 
                  queryParams: {
                    ...input
                  }
                });
        }

        if (!!this.$modal.value?.input) {
            this.$modal.next(null);
        }

        this.$modal.next({modalType: modal, input});

        return new Promise((resolve, reject) => {
            this.subscription = this.$modal
                .subscribe((m) => {
                    if (!m) {
                        resolve({ modalType: modal, input: input });
                    }
                });
          });
    }

    public close() {
        if (!this.$modal.value) {
            throw new Error('This modal already is closed');
        }

        this.$modal.next(null);
        this.subscription?.unsubscribe();
    }

    public getModal(): Observable<{modalType: Type<any>, input: any}|null> {
        return this.$modal;
    }
}