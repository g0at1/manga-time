import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-verify-email',
  imports: [CommonModule],
  template: `
    <div class="verify">
      <h2>Email verification</h2>

      <p *ngIf="state === 'loading'">Verifying your email…</p>
      <p *ngIf="state === 'success'">✅ Your email has been verified. You can now log in.</p>
      <p *ngIf="state === 'error'">❌ Verification failed. The link is invalid or expired.</p>
    </div>
  `,
})
export class VerifyEmailComponent implements OnInit {
  state: 'loading' | 'success' | 'error' = 'loading';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.state = 'error';
      return;
    }

    this.authService.confirmEmail(token).subscribe({
      next: () => {
        this.state = 'success';
      },
      error: (err) => {
        console.error(err);
        this.state = 'error';
      },
    });
  }
}
