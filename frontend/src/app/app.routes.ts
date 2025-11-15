import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RootRedirectComponent } from './core/redirect/root-redirect.component';
import { GuestGuard } from './core/guards/guest.guard';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: RootRedirectComponent },

  {
    path: 'auth',
    canMatch: [GuestGuard],
    canActivate: [GuestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },

  {
    path: 'manga',
    canMatch: [AuthGuard],
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/manga/manga.routes').then((m) => m.mangaRoutes),
  },
  {
    path: 'library',
    canMatch: [AuthGuard],
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/library/library.routes').then((m) => m.libraryRoutes),
  },
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./features/auth/verify-email.component').then((m) => m.VerifyEmailComponent),
  },

  { path: '**', redirectTo: '' },
];
