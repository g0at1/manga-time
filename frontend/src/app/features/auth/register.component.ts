import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
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
    private translate: TranslateService,
  ) {}

  register(form: NgForm) {
    this.errorMsg = '';
    this.successMsg = '';

    if (!form.valid || this.loading) return;
    if (this.password !== this.confirmPassword) {
      this.errorMsg = this.translate.instant('REGISTER.VALIDATION.PASSWORD-NOT-MATCH');
      return;
    }

    this.loading = true;
    this.auth.register({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.successMsg = this.translate.instant('REGISTER.SUCCESS');
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 1200);
      },
      error: (e) => {
        this.errorMsg = e?.error?.error ?? this.translate.instant('REGISTER.FAILED');
        this.loading = false;
      },
      complete: () => (this.loading = false),
    });
  }
}
