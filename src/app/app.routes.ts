import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'authenticated',
                loadChildren: () => 
                    import('./pages/authenticated.routes')
                        .then(a => a.AUTHENTICATED_ROUTES)
            }
        ]
    }
];
 