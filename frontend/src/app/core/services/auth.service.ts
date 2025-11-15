import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

type JwtPayload = { exp?: number; [k: string]: any };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly KEY = 'token';
  private readonly api = `${environment.apiUrl}/auth`;

  private readonly _auth$ = new BehaviorSubject<boolean>(this.hasValidToken());
  readonly auth$ = this._auth$.asObservable();

  constructor() {
    window.addEventListener('storage', (e) => {
      if (e.key === this.KEY) {
        this._auth$.next(this.hasValidToken());
      }
    });
  }

  register(data: { email: string; password: string }) {
    return this.http.post<{ token?: string }>(`${this.api}/register`, data).pipe(
      tap((resp) => {
        if (resp?.token) this.saveToken(resp.token);
      }),
    );
  }

  login(data: { email: string; password: string }) {
    return this.http
      .post<{ token: string }>(`${this.api}/login`, data)
      .pipe(tap((resp) => this.saveToken(resp.token)));
  }

  saveToken(token: string) {
    localStorage.setItem(this.KEY, token);
    this._auth$.next(this.hasValidToken());
  }

  getToken(): string | null {
    return localStorage.getItem(this.KEY);
  }

  logout() {
    localStorage.removeItem(this.KEY);
    this._auth$.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodePayload(token);
    if (!payload?.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }

  private decodePayload(token?: string): JwtPayload | null {
    const t = token ?? this.getToken();
    if (!t) return null;
    try {
      const [, payloadB64] = t.split('.');
      const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  confirmEmail(token: string) {
    return this.http.post<void>(`${this.api}/confirm-email`, { token });
  }
}
