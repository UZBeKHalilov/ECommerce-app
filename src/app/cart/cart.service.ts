import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

export interface CartItem {
  productId: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  }
}

export interface Cart {
  id: number;
  userId: string;
  items: CartItem[];
}

@Injectable({providedIn: 'root'})
export class CartService {
  private apiUrl = '/api/Carts';
  private _cart$ = new BehaviorSubject<Cart | null>(null);

  cart$ = this._cart$.asObservable();

  constructor(private http: HttpClient) {}

  loadCart(): void {
    this.http.get<Cart>(this.apiUrl).subscribe({
      next: cart => this._cart$.next(cart),
      error: () => this._cart$.next(null) // e.g. no cart
    });
  }

  addItem(productId: number, quantity: number): Observable<{message:string}> {
    return this.http.post<{message:string}>(`${this.apiUrl}/add`, { productId, quantity }).pipe(
      tap(() => this.loadCart())
    );
  }

  removeItem(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${productId}`).pipe(
      tap(() => this.loadCart())
    );
  }
}