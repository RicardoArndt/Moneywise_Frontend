import { FormControl } from "@angular/forms";
import { Input } from "./input";

export class InputSelect<TOption extends InputSelectOption> extends Input {
    constructor(
        public override readonly id: string,
        public override readonly control: FormControl,
        public override readonly label: string,
        public readonly options: TOption[], 
        public override readonly autoFocus: boolean = false
    ) {
        super(id, '', control, label, '', autoFocus);
    }
}

export class InputSelectOption {
    constructor(
        public readonly name: string,
        public readonly value: string|number
    ) { }
}
