import { Component } from "@angular/core";
import { 
    FormBuilder, 
    FormControl, 
    FormGroup, 
    ReactiveFormsModule, 
    Validators 
} from "@angular/forms";
import { CommonModule } from "@angular/common";

import { Input as InputModel } from "../../commons/input/models/input";
import { InputComponent } from "../../commons/input/input.component";

@Component({
    standalone: true,
    imports: [
        CommonModule,
        InputComponent,
        ReactiveFormsModule
    ],
    template: `
        <main class="main">
            <form class="form" [formGroup]="formGroup">
                <moneywise-app-input [input]="usernameInput" />
                <moneywise-app-input [input]="passwordInput" />
            </form>
        </main>
    `    
})
export class LoginComponent {
    public formGroup: FormGroup = this.formBuilder.group({
        username: this.formBuilder.control(null, [Validators.required]),
        password: this.formBuilder.control(null, [Validators.required])
    });

    public usernameInput: InputModel = new InputModel(
        "username",
        "text",
        this.formGroup.get("username") as FormControl,
        "Usuário",
        "username",
        true
    );

    public passwordInput: InputModel = new InputModel(
        "password",
        "password",
        this.formGroup.get("password") as FormControl,
        "Senha",
        "password"
    );

    constructor(
        private readonly formBuilder: FormBuilder
    ) { }
}
