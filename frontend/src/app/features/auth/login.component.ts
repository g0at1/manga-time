import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  errorMsg = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.errorMsg = '';
    if (this.loading) return;

    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (r) => {
        this.auth.saveToken(r.token);
        this.router.navigateByUrl('/manga');
      },
      error: (e) => {
        this.errorMsg = e?.error?.error ?? 'Login failed';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
