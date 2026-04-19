import { Component, Input, Inject, HostListener } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

export interface NavLink {
  label: string;
  route?: string;
  fragment?: string;
}

@Component({
  selector: 'app-shared-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class SharedHeaderComponent {
  @Input() navLinks: NavLink[] = [];

  isLangDropdownOpen = false;
  isMobileMenuOpen = false;
  currentLang = 'DE';
  languages = [
    { code: 'en', name: 'EN' },
    { code: 'de', name: 'DE' },
    { code: 'tr', name: 'TR' }
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public cartService: CartService,
    private router: Router
  ) {
    const langCode = this.document.location.pathname.split('/')[1];
    const foundLang = this.languages.find(lang => lang.code === langCode);
    this.currentLang = foundLang ? foundLang.name : 'DE';
  }

  goToAnchor(route: string, fragment: string) {
    this.isMobileMenuOpen = false;
    this.router.navigate([route]).then(() => {
      setTimeout(() => {
        const el = this.document.getElementById(fragment);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    });
  }

  toggleLangDropdown() {
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  switchLang(code: string) {
    const pathname = this.document.location.pathname;
    const locales = ['en', 'de', 'tr'];
    const currentLocale = locales.find(l => pathname.startsWith('/' + l + '/') || pathname === '/' + l);
    if (currentLocale) {
      const route = pathname.slice(('/' + currentLocale).length) || '/';
      this.document.location.href = '/' + code + route;
    } else {
      this.document.location.href = '/' + code + '/';
    }
  }

  @HostListener('document:click', ['$event'])
  closeLangDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.lang-dropdown')) {
      this.isLangDropdownOpen = false;
    }
  }
}
