import { Component, Input, Inject, HostListener } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

export interface NavLink {
  label: string;
  route?: string;
  fragment?: string;
}

interface SearchItem {
  label: string;
  sublabel: string;
  route: string;
  fragment?: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { label: 'Home',             sublabel: 'Startseite',              route: '/' },
  { label: 'Über uns',         sublabel: 'About',                   route: '/', fragment: 'about' },
  { label: 'Leistungen',       sublabel: 'Services',                route: '/', fragment: 'services' },
  { label: 'Kontakt',          sublabel: 'Contact',                 route: '/', fragment: 'contact' },
  { label: 'Acrylglasbilder',  sublabel: 'Ready-Made Acryl Prints', route: '/ready-made-acrylglasbilder' },
  { label: 'Leinwandbilder',   sublabel: 'Ready-Made Canvas Prints',route: '/ready-made-leinwandbilder' },
  { label: 'Vinyl Sticker',    sublabel: 'Custom Vinyl Sticker',    route: '/vinyl-sticker' },
  { label: 'Warenkorb',        sublabel: 'Shopping Cart',           route: '/warenkorb' },
];

@Component({
  selector: 'app-shared-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class SharedHeaderComponent {
  @Input() navLinks: NavLink[] = [];

  searchQuery = '';
  isSearchOpen = false;
  searchResults: SearchItem[] = [];

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

  onSearchInput() {
    const q = this.searchQuery.trim().toLowerCase();
    if (q.length < 1) {
      this.searchResults = [];
      this.isSearchOpen = false;
      return;
    }
    this.searchResults = SEARCH_ITEMS.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.sublabel.toLowerCase().includes(q)
    );
    this.isSearchOpen = this.searchResults.length > 0;
  }

  onSearchSelect(item: SearchItem) {
    this.searchQuery = '';
    this.isSearchOpen = false;
    this.searchResults = [];
    if (item.fragment) {
      this.goToAnchor(item.route, item.fragment);
    } else {
      this.router.navigate([item.route]);
    }
  }

  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.isSearchOpen = false;
      this.searchQuery = '';
      this.searchResults = [];
    } else if (event.key === 'Enter' && this.searchResults.length > 0) {
      this.onSearchSelect(this.searchResults[0]);
    }
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
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.lang-dropdown')) {
      this.isLangDropdownOpen = false;
    }
    if (!target.closest('.search-wrapper')) {
      this.isSearchOpen = false;
    }
  }
}
