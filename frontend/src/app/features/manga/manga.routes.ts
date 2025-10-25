import { Routes } from '@angular/router';
import { MangaListComponent } from './manga-list.component';
import { MangaDetailComponent } from './manga-detail.component';

export const mangaRoutes: Routes = [
  { path: '', component: MangaListComponent },
  { path: ':id', component: MangaDetailComponent },
];
