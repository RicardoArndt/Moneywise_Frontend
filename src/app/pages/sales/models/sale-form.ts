import { FormGroup } from "@angular/forms";

export interface ISaleForm {
    name: string;
    title: string;
    form: { formGroup: FormGroup };
}