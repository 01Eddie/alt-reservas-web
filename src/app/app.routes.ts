import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { authGuard } from './core/auth-guard';
import { Reservations } from './features/dashboard/reservations/reservations';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { ChangePassword } from './features/auth/change-password/change-password';

export const routes: Routes = [
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'reservation', component: Reservations, canActivate: [authGuard] },
    { path: 'reset-password', component: ResetPassword },
    { path: 'change-password', component: ChangePassword },
    // { path: 'login', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) }, 
    // { path: '', redirectTo: 'register', pathMatch: 'full' },
];
