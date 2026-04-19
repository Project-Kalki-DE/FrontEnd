import { Component, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CartService, CartItem } from '../services/cart.service';
import { SharedHeaderComponent } from '../shared/header/header.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-warenkorb',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SharedHeaderComponent],
  templateUrl: './warenkorb.component.html',
  styleUrls: ['./warenkorb.component.css']
})
export class WarenkorbComponent {
  readonly headerNav = [
    { label: 'Home', route: '/' },
    { label: 'Kontakt', route: '/', fragment: 'contact' },
  ];

  customerEmail = '';
  isLoading = false;
  errorMsg = '';
  orderId = '';

  constructor(
    public cartService: CartService,
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  get items(): CartItem[] {
    return this.cartService.items;
  }

  get subtotal(): string {
    let total = 0;
    for (const item of this.items) {
      const num = parseFloat(item.price.replace(/[^0-9.,]/g, '').replace(',', '.'));
      if (!isNaN(num)) total += num * item.menge;
    }
    return total.toFixed(2).replace('.', ',') + ' €';
  }

  removeItem(id: string) {
    this.cartService.removeItem(id);
  }

  getProductTypeLabel(productType: string): string {
    if (productType === 'acryl') return $localize`:@@wk_type_acryl:Acrylglas`;
    if (productType === 'leinwand') return $localize`:@@wk_type_leinwand:Leinwand`;
    return productType;
  }

  getDesignLabel(item: CartItem): string {
    if (item.productType === 'acryl' && item.shape === 'round') {
      return $localize`:@@acryl_christRound_fullname:CHRISTUS – RUND`;
    }
    const series = $localize`:@@series_lastSupper:LETZTE ABENDMAHL`;
    return `${series} – DESIGN ${item.designId}`;
  }

  getZubehorLabel(item: CartItem): string {
    if (item.zubehor === 'hook') {
      if (item.productType === 'acryl' && item.shape !== 'round') {
        return $localize`:@@zubehor_edelstahl:Edelstahl-Abstandshalter`;
      }
      return $localize`:@@zubehor_hook:Metallhaken`;
    }
    return '';
  }

  getRahmenLabel(rahmen: string): string {
    switch (rahmen) {
      case '2cm': return '2 CM';
      case '4cm': return '4 CM';
      default: return rahmen;
    }
  }

  placeOrder() {
    this.errorMsg = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.customerEmail.trim()) {
      this.errorMsg = $localize`:@@wk_error_email_required:Bitte geben Sie Ihre E-Mail-Adresse ein.`;
      return;
    }
    if (!emailRegex.test(this.customerEmail.trim())) {
      this.errorMsg = $localize`:@@wk_error_email_invalid:Bitte geben Sie eine gültige E-Mail-Adresse ein.`;
      return;
    }
    this.isLoading = true;
    const payload = {
      customerEmail: this.customerEmail,
      items: this.items.map(i => ({
        productType: i.productType,
        designFullName: i.designFullName,
        formatLabel: i.formatLabel,
        price: i.price,
        zubehor: i.zubehor,
        rahmen: i.rahmen,
        menge: i.menge,
      }))
    };
    this.http.post<{ orderId: string; message: string }>(`${environment.apiUrl}/api/order`, payload).subscribe({
      next: (res) => {
        this.orderId = res.orderId;
        this.cartService.clearCart();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Fehler beim Senden der Bestellung. Bitte versuchen Sie es erneut.';
        this.isLoading = false;
      }
    });
  }
}
