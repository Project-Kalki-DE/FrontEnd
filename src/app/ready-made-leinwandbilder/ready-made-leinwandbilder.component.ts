import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedHeaderComponent } from '../shared/header/header.component';
import { CartService } from '../services/cart.service';

const LW_SERIES = $localize`:@@series_lastSupper:LETZTE ABENDMAHL`;

@Component({
  selector: 'app-ready-made-leinwandbilder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedHeaderComponent],
  templateUrl: './ready-made-leinwandbilder.component.html',
  styleUrls: ['./ready-made-leinwandbilder.component.css']
})
export class ReadyMadeLeinwandbilderComponent implements OnInit, OnDestroy {
  constructor(private cartService: CartService, private router: Router) {}

  readonly headerNav = [
    { label: 'Home', route: '/' },
    { label: 'Kontakt', route: '/', fragment: 'contact' },
  ];

  designs = [
    {
      id: 1, name: 'DESIGN 1',
      fullName: `${LW_SERIES} – DESIGN 1`,
      thumb: 'assets/images/leinwand-design-1.jpeg',
      full:  'assets/images/leinwand-design-1.jpeg',
      wall:  'assets/images/leinwand-wall.jpg'
    },
    {
      id: 2, name: 'DESIGN 2',
      fullName: `${LW_SERIES} – DESIGN 2`,
      thumb: 'assets/images/leinwand-design-2.jpeg',
      full:  'assets/images/leinwand-design-2.jpeg',
      wall:  'assets/images/leinwand-wall.jpg'
    },
    {
      id: 3, name: 'DESIGN 3',
      fullName: `${LW_SERIES} – DESIGN 3`,
      thumb: 'assets/images/leinwand-design-3.jpeg',
      full:  'assets/images/leinwand-design-3.jpeg',
      wall:  'assets/images/leinwand-wall.jpg'
    },
    {
      id: 4, name: 'DESIGN 4',
      fullName: `${LW_SERIES} – DESIGN 4`,
      thumb: 'assets/images/leinwand-design-4.jpeg',
      full:  'assets/images/leinwand-design-4.jpeg',
      wall:  'assets/images/leinwand-wall.jpg'
    },
    {
      id: 5, name: 'DESIGN 5',
      fullName: `${LW_SERIES} – DESIGN 5`,
      thumb: 'assets/images/leinwand-design-5.jpeg',
      full:  'assets/images/leinwand-design-5.jpeg',
      wall:  'assets/images/leinwand-wall.jpg'
    },
    {
      id: 6, name: 'DESIGN 6',
      fullName: `${LW_SERIES} – DESIGN 6`,
      thumb: 'assets/images/leinwand-design-6.jpeg',
      full:  'assets/images/leinwand-design-6.jpeg',
      wall:  'assets/images/leinwand-wall.jpg'
    },
  ];

  selectedDesign = this.designs[0];

  // Carousel – infinite loop: render [designs × 3], start in middle copy
  loopedDesigns: any[] = [];
  readonly THUMB_WIDTH = 194; // 180px card + 14px gap
  carouselOffset = 0;
  noTransition = false;
  private resetTimer: any;
  touchStartX = 0;

  // Config
  selectedZubehor = 'none';

  formatOptions = [
    { id: '70x50',  label: '70 × 50 cm',  price: '40 €',  note: '' },
    { id: '100x50', label: '100 × 50 cm', price: '60 €',  note: '' },
    { id: '140x75', label: '140 × 75 cm', price: '110 €', note: '+ zzgl. 19 % MwSt. und Versand' },
  ];
  selectedFormat = '70x50';

  rahmenOptions = [
    { id: '2cm', label: '2 CM', img: 'assets/images/leinwand-rahmen-2cm.jpg' },
    { id: '4cm', label: '4 CM', img: 'assets/images/leinwand-rahmen-4cm.jpg' },
  ];
  selectedRahmen = '2cm';

  menge = 1;

  ngOnInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
    this.loopedDesigns = [...this.designs, ...this.designs, ...this.designs];
    this.carouselOffset = this.designs.length * this.THUMB_WIDTH;
  }

  ngOnDestroy() {
    clearTimeout(this.resetTimer);
  }

  selectDesign(d: any) {
    this.selectedDesign = d;
    clearTimeout(this.resetTimer);
    const idx = this.designs.findIndex((x: any) => x.id === d.id);
    this.noTransition = true;
    this.carouselOffset = (this.designs.length + idx) * this.THUMB_WIDTH;
    setTimeout(() => { this.noTransition = false; }, 50);
  }

  nextSlide() {
    const N = this.designs.length;
    this.carouselOffset += this.THUMB_WIDTH;
    const rawIdx = Math.round(this.carouselOffset / this.THUMB_WIDTH);
    this.selectedDesign = this.designs[rawIdx % N];
    if (this.carouselOffset >= N * 2 * this.THUMB_WIDTH) {
      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(() => {
        this.noTransition = true;
        this.carouselOffset -= N * this.THUMB_WIDTH;
        setTimeout(() => { this.noTransition = false; }, 50);
      }, 420);
    }
  }

  scrollDesigns(direction: number) {
    clearTimeout(this.resetTimer);
    if (direction > 0) {
      this.nextSlide();
    } else {
      const N = this.designs.length;
      this.carouselOffset -= this.THUMB_WIDTH;
      const rawIdx = Math.round(this.carouselOffset / this.THUMB_WIDTH);
      this.selectedDesign = this.designs[((rawIdx % N) + N) % N];
      if (this.carouselOffset < N * this.THUMB_WIDTH) {
        this.resetTimer = setTimeout(() => {
          this.noTransition = true;
          this.carouselOffset += N * this.THUMB_WIDTH;
          setTimeout(() => { this.noTransition = false; }, 50);
        }, 420);
      }
    }
  }

  increment() { this.menge++; }
  decrement() { if (this.menge > 1) this.menge--; }

  onOrder() {
    const fmt = this.formatOptions.find(f => f.id === this.selectedFormat);
    this.cartService.addItem({
      productType: 'leinwand',
      designId: this.selectedDesign.id,
      designFullName: this.selectedDesign.fullName,
      thumb: this.selectedDesign.thumb,
      formatId: this.selectedFormat,
      formatLabel: fmt?.label ?? '',
      price: fmt?.price ?? '',
      zubehor: this.selectedZubehor,
      rahmen: this.selectedRahmen,
      menge: this.menge
    });
    this.router.navigate(['/warenkorb']);
  }
}
