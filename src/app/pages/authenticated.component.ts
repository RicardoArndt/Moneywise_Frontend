import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { HeaderComponent } from "../layout/header/header.component";

@Component({
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        HeaderComponent
    ],
    template: `
        <moneywise-app-header />

        <main class="main">
            <router-outlet></router-outlet>
        </main>
    `
})
export class AuthenticatedComponent { }