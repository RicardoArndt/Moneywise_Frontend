import { FormGroup } from "@angular/forms";

export interface IFormComponent {
    name: string;
    title: string; 
    formGroup: FormGroup;
    onSave: () => Promise<void>;
}