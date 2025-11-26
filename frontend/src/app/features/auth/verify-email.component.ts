import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-verify-email',
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="verify">
      <h2>{{ 'VERIFY-EMAIL.TITLE' | translate }}</h2>

      <p *ngIf="state === 'loading'">{{ 'VERIFY-EMAIL.VERIFYING' | translate }}</p>
      <p *ngIf="state === 'success'">{{ 'VERIFY-EMAIL.SUCCESS' | translate }}</p>
      <p *ngIf="state === 'error'">{{ 'VERIFY-EMAIL.ERROR' | translate }}</p>
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
