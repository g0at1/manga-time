import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root-redirect',
  standalone: true,
  template: '',
})
export class RootRedirectComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  constructor() {
    this.router.navigateByUrl(this.auth.isAuthenticated() ? '/manga' : '/auth/login', {
      replaceUrl: true,
    });
  }
}
