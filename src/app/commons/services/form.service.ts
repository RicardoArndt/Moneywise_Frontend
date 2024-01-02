import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class FormService {
    private readonly $isSubmitted: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public isSubmitted(): Observable<boolean> {
        return this.$isSubmitted;
    }

    public submit() {
        this.$isSubmitted.next(true);
    }
} 