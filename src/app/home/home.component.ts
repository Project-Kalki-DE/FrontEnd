import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('servicesScroll', { static: false }) servicesScroll!: ElementRef;

  isLangDropdownOpen = false;
  currentLang = 'DE';
  languages = [
    { code: 'en', name: 'EN' },
    { code: 'de', name: 'DE' },
    { code: 'tr', name: 'TR' }
  ];

  constructor(@Inject(DOCUMENT) private document: Document) {
    const langCode = this.document.location.pathname.split('/')[1];
    const foundLang = this.languages.find(lang => lang.code === langCode);
    this.currentLang = foundLang ? foundLang.name : 'DE';
  }

  toggleLangDropdown() {
    this.isLangDropdownOpen = !this.isLangDropdownOpen;
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
}
