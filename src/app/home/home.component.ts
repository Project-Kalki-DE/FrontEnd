import { Component, ViewChild, ElementRef, Inject, HostListener } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('servicesScroll', { static: false }) servicesScroll!: ElementRef;

  searchQuery = '';
  isSearchOpen = false;
  searchResults: SearchItem[] = [];

  isLangDropdownOpen = false;
  isMobileMenuOpen = false;
  isLimitierteOpen = false;
  currentLang = 'DE';
  languages = [
    { code: 'en', name: 'EN' },
    { code: 'de', name: 'DE' },
    { code: 'tr', name: 'TR' }
  ];

  contactName = '';
  contactEmail = '';
  contactSubject = '';
  contactMessage = '';
  contactNameError = false;
  contactEmailError = false;
  contactMessageError = false;
  contactSubmitted = false;
  contactSubmitting = false;
  contactSendError = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public cartService: CartService,
    private http: HttpClient,
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
      this.router.navigate([item.route]).then(() => {
        setTimeout(() => {
          this.document.getElementById(item.fragment!)?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      });
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

  toggleLangDropdown() {
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  switchLang(code: string) {
    this.document.location.href = '/' + code + '/';
  }

  scrollTo(section: string) {
    this.document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleLimitierteMenu() {
    this.isLimitierteOpen = !this.isLimitierteOpen;
  }

  @HostListener('document:click', ['$event'])
  closeLimitierteMenu(event: Event) {
    const target = event.target as HTMLElement;
    this.isLimitierteOpen = false;
    if (!target.closest('.lang-dropdown')) {
      this.isLangDropdownOpen = false;
    }
    if (!target.closest('.search-wrapper')) {
      this.isSearchOpen = false;
    }
  }

  scrollServices(direction: 'left' | 'right') {
    const container = this.servicesScroll?.nativeElement;
    if (container) {
      const scrollAmount = 250;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  validateContactName() {
    this.contactNameError = !this.contactName.trim();
  }

  validateContactEmail() {
    this.contactEmailError = !this.isValidEmail(this.contactEmail);
  }

  validateContactMessage() {
    this.contactMessageError = !this.contactMessage.trim();
  }

  submitContact() {
    this.validateContactName();
    this.validateContactEmail();
    this.validateContactMessage();
    if (this.contactNameError || this.contactEmailError || this.contactMessageError) return;

    this.contactSubmitting = true;
    this.contactSendError = false;

    const payload = {
      name: this.contactName.trim(),
      email: this.contactEmail.trim(),
      subject: this.contactSubject.trim(),
      message: this.contactMessage.trim(),
    };

    this.http.post(`${environment.apiUrl}/api/contact`, payload).subscribe({
      next: () => {
        this.contactSubmitted = true;
        this.contactSubmitting = false;
        this.contactName = '';
        this.contactEmail = '';
        this.contactSubject = '';
        this.contactMessage = '';
      },
      error: () => {
        this.contactSendError = true;
        this.contactSubmitting = false;
      },
    });
  }
}
