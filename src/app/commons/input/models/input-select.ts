import { FormControl } from "@angular/forms";
import { Input } from "./input";

export class InputSelect<TOption extends InputSelectOption> extends Input {
    constructor(
        public override readonly id: string,
        public override readonly control: FormControl,
        public override readonly label: string,
        public readonly options: TOption[], 
        public override readonly autoFocus: boolean = false,
        public override title: string = ''
    ) {
        super(id, '', control, label, '', autoFocus, false, false, title);
    }

    public add(option: TOption) {
        if (this.options.map(o => o.name).includes(option.name)) {
            return;
        }

        this.options.push(option);
    }

    public addRange(options: TOption[]) {
        const validatedOptions = options.filter((opt, index) => 
            options.map(o => o.name).indexOf(opt.name) == index);
            
        for (const option of validatedOptions) {
            this.options.push(option);
        }
    }
}

export class InputSelectOption {
    constructor(
        public readonly name: string,
        public readonly value: string|number
    ) { }
}
