import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { GuestGuard } from '../../core/guards/guest.guard';

export const authRoutes: Routes = [
  {
    path: '',
    canMatch: [GuestGuard],
    canActivate: [GuestGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];
