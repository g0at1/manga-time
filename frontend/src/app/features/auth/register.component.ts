import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  register(form: NgForm) {
    this.errorMsg = '';
    this.successMsg = '';

    if (!form.valid || this.loading) return;
    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.auth.register({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.successMsg = 'Account created successfully! You can now log in.';
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 1200);
      },
      error: (e) => {
        this.errorMsg = e?.error?.error ?? 'Registration failed.';
      },
      complete: () => (this.loading = false),
    });
  }
}
