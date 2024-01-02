import { FormControl } from "@angular/forms";
import { Input } from "./input";

export class InputPhone extends Input {
    constructor(
        public override readonly id: string,
        public override readonly control: FormControl,
        public override readonly label: string,
        public override readonly autoFocus: boolean = false
    ) { 
        super(id, 'text', control, label, '', autoFocus, true); 
    }
}