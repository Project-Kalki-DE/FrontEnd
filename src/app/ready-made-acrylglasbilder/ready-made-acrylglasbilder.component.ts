import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedHeaderComponent } from '../shared/header/header.component';
import { CartService } from '../services/cart.service';

const AC_SERIES = $localize`:@@series_lastSupper:LETZTE ABENDMAHL`;
const AC_CHRIST_ROUND = $localize`:@@acryl_christRound_fullname:CHRISTUS – RUND`;

interface Design {
  id: number;
  thumb: string;
  full: string;
  wall: string;
  name: string;
  fullName: string;
  shape?: 'round';
}

interface FormatOption {
  id: string;
  label: string;
  price: string;
  note?: string;
}

@Component({
  selector: 'app-ready-made-acrylglasbilder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SharedHeaderComponent],
  templateUrl: './ready-made-acrylglasbilder.component.html',
  styleUrls: ['./ready-made-acrylglasbilder.component.css']
})
export class ReadyMadeAcrylglasbilderComponent implements OnInit, OnDestroy {
  constructor(private cartService: CartService, private router: Router) {}

  readonly headerNav = [
    { label: 'Home', route: '/' },
    { label: 'Kontakt', route: '/', fragment: 'contact' },
  ];

  designs: Design[] = [
    {
      id: 1, name: 'DESIGN 1', fullName: `${AC_SERIES} – DESIGN 1`,
      thumb: 'assets/images/acryl-design-1.jpeg', full: 'assets/images/acryl-design-1.jpeg', wall: 'assets/images/acryl-wall.jpg'
    },
    {
      id: 2, name: 'DESIGN 2', fullName: `${AC_SERIES} – DESIGN 2`,
      thumb: 'assets/images/acryl-design-2.jpeg', full: 'assets/images/acryl-design-2.jpeg', wall: 'assets/images/acryl-wall.jpg'
    },
    {
      id: 3, name: 'DESIGN 3', fullName: `${AC_SERIES} – DESIGN 3`,
      thumb: 'assets/images/acryl-design-3.jpeg', full: 'assets/images/acryl-design-3.jpeg', wall: 'assets/images/acryl-wall.jpg'
    },
    {
      id: 4, name: 'DESIGN 4', fullName: `${AC_SERIES} – DESIGN 4`,
      thumb: 'assets/images/acryl-design-4.jpeg', full: 'assets/images/acryl-design-4.jpeg', wall: 'assets/images/acryl-wall.jpg'
    },
    {
      id: 5, name: 'DESIGN 5', fullName: `${AC_SERIES} – DESIGN 5`,
      thumb: 'assets/images/acryl-design-5.jpeg', full: 'assets/images/acryl-design-5.jpeg', wall: 'assets/images/acryl-wall.jpg'
    },
    {
      id: 6, name: 'DESIGN 6', fullName: `${AC_SERIES} – DESIGN 6`,
      thumb: 'assets/images/acryl-design-6.jpeg', full: 'assets/images/acryl-design-6.jpeg', wall: 'assets/images/acryl-wall.jpg'
    },
    {
      id: 7, name: 'CHRIST-ROUND', fullName: AC_CHRIST_ROUND,
      thumb: 'assets/images/acryl-christ-round.png', full: 'assets/images/acryl-christ-round.png', wall: 'assets/images/acryl-christ-round-wall.jpg',
      shape: 'round'
    }
  ];

  selectedDesign = this.designs[0];

  // Carousel – infinite loop: render [designs × 3], start in middle copy
  loopedDesigns: Design[] = [];
  readonly THUMB_WIDTH = 194; // 180px card + 14px gap
  carouselOffset = 0;
  noTransition = false;
  private resetTimer: any;
  touchStartX = 0;

  // Config
  selectedZubehor = 'none';
  acrylStaerke = '4mm';
  menge = 1;

  formatOptions: FormatOption[] = [
    { id: '60x30',  label: '60 × 30 cm',  price: '60 €' },
    { id: '120x60', label: '120 × 60 cm', price: '190 €' },
    { id: '100x50', label: '100 × 50 cm', price: '130 €' },
    { id: '130x65', label: '130 × 65 cm', price: '210 €', note: '+ zzgl. 19 % MwSt. und Versand' }
  ];
  roundFormatOptions: FormatOption[] = [
    { id: '60x60', label: '60 × 60 cm', price: '80 €', note: '+ zzgl. 19 % MwSt. und Versand' }
  ];
  selectedFormat = this.formatOptions[0].id;

  get activeFormatOptions(): FormatOption[] {
    return this.selectedDesign.shape === 'round' ? this.roundFormatOptions : this.formatOptions;
  }

  ngOnInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
    // Triple the array so we can scroll infinitely in both directions
    this.loopedDesigns = [...this.designs, ...this.designs, ...this.designs];
    // Start offset at beginning of middle copy
    this.carouselOffset = this.designs.length * this.THUMB_WIDTH;
  }

  ngOnDestroy() {
    clearTimeout(this.resetTimer);
  }

  selectDesign(d: Design) {
    this.selectedDesign = d;
    clearTimeout(this.resetTimer);
    const idx = this.designs.findIndex(x => x.id === d.id);
    this.noTransition = true;
    this.carouselOffset = (this.designs.length + idx) * this.THUMB_WIDTH;
    setTimeout(() => { this.noTransition = false; }, 50);
    // Reset format to first option for the selected design type
    this.selectedFormat = this.activeFormatOptions[0].id;
  }

  nextSlide() {
    const N = this.designs.length;
    this.carouselOffset += this.THUMB_WIDTH;
    const rawIdx = Math.round(this.carouselOffset / this.THUMB_WIDTH);
    this.selectedDesign = this.designs[rawIdx % N];
    // Entered the third copy — silently reset to equivalent middle-copy position after transition
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
    const format = this.activeFormatOptions.find(f => f.id === this.selectedFormat);
    this.cartService.addItem({
      productType: 'acryl',
      designId: this.selectedDesign.id,
      designFullName: this.selectedDesign.fullName,
      thumb: this.selectedDesign.thumb,
      shape: this.selectedDesign.shape,
      formatId: this.selectedFormat,
      formatLabel: format?.label ?? '',
      price: format?.price ?? '',
      zubehor: this.selectedZubehor,
      menge: this.menge
    });
    this.router.navigate(['/warenkorb']);
  }
}
