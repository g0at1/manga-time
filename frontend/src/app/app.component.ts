import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { ToastContainerComponent } from './shared/components/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastContainerComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="p-4 max-w-4xl mx-auto">
      <router-outlet></router-outlet>
      <app-toast-container></app-toast-container>
    </main>
  `,
})
export class AppComponent {}
