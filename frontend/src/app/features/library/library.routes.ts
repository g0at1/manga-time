import { Routes } from '@angular/router';
import { LibraryListComponent } from './library-list.component';
import { LibraryDetailComponent } from './library-detail.component';

export const libraryRoutes: Routes = [
  { path: '', component: LibraryListComponent },
  { path: ':id', component: LibraryDetailComponent },
];
