import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isMenuOpen = false;
  isScrolled = false;
  currentLang = 'en';

  constructor(
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
  ) {
    this.translate.addLangs(['en', 'pl']);
    this.translate.setDefaultLang('en');

    const saved = localStorage.getItem('lang');
    const initial = saved || 'en';

    this.translate.use(initial);
    this.currentLang = initial;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  changeLang(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.currentLang = value;
    this.translate.use(value);
    localStorage.setItem('lang', value);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 4;
  }
}
