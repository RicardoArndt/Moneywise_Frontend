import { Routes } from "@angular/router";
import { CashFlowComponent } from "./cash-flow/cash-flow.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SalesComponent } from "./sales/sales.component";
import { SettingsComponent } from "./settings/settings.component";
import { UsersComponent } from "./users/users.component";
import { AuthenticatedComponent } from "./authenticated.component";

export const AUTHENTICATED_ROUTES: Routes = [
    {
        path: '',
        component: AuthenticatedComponent,
        children: [
            {
                path: '',
                title: 'Dashboard',
                component: DashboardComponent
            },
            {
                path: 'cash-flow',
                title: 'Fluxo de Caixa',
                component: CashFlowComponent
            },
            {
                path: 'sales',
                title: 'Vendas',
                component: SalesComponent
            },
            {
                path: 'users',
                title: 'Users',
                component: UsersComponent
            },
            {
                path: 'settings',
                title: 'Settings',
                component: SettingsComponent
            }
        ]
    }
];
