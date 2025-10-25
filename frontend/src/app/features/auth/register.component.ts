import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2>Register</h2>
    <div style="max-width:360px">
      <label>Email</label>
      <input class="border p-2 w-full" [(ngModel)]="email" type="email" />

      <label style="margin-top:8px;display:block">Password</label>
      <input class="border p-2 w-full" [(ngModel)]="password" type="password" />

      <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
        <button (click)="register()" class="border px-3 py-2">Create account</button>
        <a routerLink="/auth/login">Back to login</a>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  email = '';
  password = '';
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}
  register() {
    this.auth.register({ email: this.email, password: this.password }).subscribe({
      next: () => {
        alert('Registered, now login');
        this.router.navigateByUrl('/auth/login');
      },
      error: (e) => alert(e.error?.error || 'Register failed'),
    });
  }
}
