import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Login</h2>
    <div style="max-width:360px">
      <label>Email</label>
      <input class="border p-2 w-full" [(ngModel)]="email" type="email" />

      <label style="margin-top:8px;display:block">Password</label>
      <input class="border p-2 w-full" [(ngModel)]="password" type="password" />

      <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
        <button (click)="login()" class="border px-3 py-2">Login</button>
        <a routerLink="/auth/register">Register</a>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = 'demo@demo.com';
  password = 'demo123';
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (r) => {
        this.auth.saveToken(r.token);
        this.router.navigateByUrl('/manga');
      },
      error: (e) => alert(e.error?.error || 'Login failed'),
    });
  }
}
