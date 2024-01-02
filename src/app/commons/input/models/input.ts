import { AbstractControl, FormControl } from "@angular/forms";

export class Input {
    constructor(
        public readonly id: string,
        public readonly type: 'text'|'number'|'',
        public readonly control: FormControl,
        public readonly label: string,
        public readonly autocomplete?: string,
        public readonly autoFocus: boolean = false,
        public readonly usePhoneMask: boolean = false,
        public readonly useCurrencyMask: boolean = false
    ) { }

    public* getErrorsMessage(submitted: boolean) {
        if (!this.control.errors || (!this.control.touched && !submitted)) {
            return '';
        }
        
        yield this.isRequired();
        yield this.minLength();
        yield this.maxLength();

        return '';
    }

    protected isRequired() {
        if (this.control.errors!['required']) {
            return 'O campo é obrigatório';
        }

        return '';
    }

    protected minLength() {
        if (this.control.errors!['minlength']) {
            return `O campo deve ter no mínimo ${this.control.errors!['minlength'].requiredLength} caracteres`
        }

        return '';
    }

    protected maxLength() {
        if (this.control.errors!['maxlength']) {
            return `O campo deve ter no máximo ${this.control.errors!['maxlength'].requiredLength} caracteres`
        }

        return '';
    }
}
