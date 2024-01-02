import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SalesComponent } from './pages/sales/sales.component';
import { UsersComponent } from './pages/users/users.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                title: 'Dashboard',
                component: DashboardComponent
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
 