import { FormGroup } from "@angular/forms";

export interface IFormComponent {
    isEdit: boolean;
    name: string;
    title: string; 
    formGroup: FormGroup;
    onSave: () => Promise<void>;
    onEdit: () => Promise<void>;
}