import { Component, ViewChild, ElementRef, Inject, HostListener } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
    private http: HttpClient
  ) {
    const langCode = this.document.location.pathname.split('/')[1];
    const foundLang = this.languages.find(lang => lang.code === langCode);
    this.currentLang = foundLang ? foundLang.name : 'DE';
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
