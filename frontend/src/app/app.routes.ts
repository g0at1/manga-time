import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'manga',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'manga',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/manga/manga.routes').then((m) => m.mangaRoutes),
  },
  {
    path: 'library',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/library/library.routes').then((m) => m.libraryRoutes),
  },
  { path: '**', redirectTo: 'manga' },
];
