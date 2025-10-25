import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="p-4 bg-gray-900 text-white flex space-x-4">
      <a routerLink="/manga" class="hover:underline">Manga</a>
      <a routerLink="/library" class="hover:underline">My Library</a>
      <a routerLink="/auth/login" class="ml-auto hover:underline">Logout</a>
    </nav>
  `,
})
export class NavbarComponent {}
