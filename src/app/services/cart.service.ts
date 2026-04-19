import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export interface CartItem {
  id: string;
  productType: 'acryl' | 'leinwand';
  designId: number;
  designFullName: string;
  thumb: string;
  shape?: 'round';
  formatId: string;
  formatLabel: string;
  price: string;
  zubehor: string;
  rahmen?: string;
  menge: number;
}

const STORAGE_KEY = 'kalki_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = new BehaviorSubject<CartItem[]>(this.load());

  items$ = this._items.asObservable();
  cartCount$ = this._items.pipe(map(items => items.reduce((sum, i) => sum + i.menge, 0)));

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(items: CartItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  addItem(item: Omit<CartItem, 'id'>) {
    const newItem: CartItem = { ...item, id: Date.now().toString() + Math.random().toString(36).slice(2) };
    const updated = [...this._items.value, newItem];
    this._items.next(updated);
    this.save(updated);
  }

  removeItem(id: string) {
    const updated = this._items.value.filter(i => i.id !== id);
    this._items.next(updated);
    this.save(updated);
  }

  clearCart() {
    this._items.next([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  get items(): CartItem[] {
    return this._items.value;
  }
}
