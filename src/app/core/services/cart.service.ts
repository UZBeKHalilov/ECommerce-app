import { inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { Router } from '@angular/router';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cartItem.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { routes } from '../../app.routes';
import { Order } from '../models/order.model';
import { OrderItem as items } from '../models/orderItem.model';


@Injectable({ providedIn: 'root' })
export class CartService {
  private _cart$ = new BehaviorSubject<Cart | null>(null);

  cart$ = this._cart$.asObservable();
  cartItemsCount$ = this.cart$.pipe(
    map(cart => (cart ? cart.items.length : 0))
  );

  private authService: AuthService = inject(AuthService);

  constructor(private router: Router) {
    // this.checkIsloggedIn();
    this.loadCart();
  }

  private saveCartToLocalStorage(cart: Cart | null): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        console.log('Cart is null, not saving to localStorage');
      }
    }
  }

  private getCartFromLocalStorage(): Cart | null {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const cartJson = localStorage.getItem('cart');
      console.log('Cart from localStorage:', cartJson);
      return cartJson ? JSON.parse(cartJson) : null;
    }
    return null;
  }

  addToCart(product: Product, quantity: number): void {
    this.checkIsloggedIn();
    const currentCart = this._cart$.value || { items: [] };
    const existingItem = currentCart.items.find(item => item.productId === product.id);


    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem: CartItem = {
        productId: product.id,
        product: product,
        quantity: quantity
      };
      currentCart.items.push(newItem);
    }

    this._cart$.next(currentCart);
    this.saveCartToLocalStorage(currentCart);
    console.log('Cart added:', currentCart);
  }

  removeItem(productId: number): Observable<void> {
    this.checkIsloggedIn();
    const currentCart = this._cart$.value;

    return new Observable<void>(observer => {
      if (currentCart) {
        currentCart.items = currentCart.items.filter(item => item.productId !== productId);
        this._cart$.next(currentCart);
        this.saveCartToLocalStorage(currentCart);
      }
      observer.next();
      observer.complete();
    });
  }

  loadCart(): void {
    // this.checkIsloggedIn();
    const cart = this.getCartFromLocalStorage();
    this._cart$.next(cart);
  }

  removeCart(): void {
    this._cart$.next(null);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('cart');
    }
  }

  private checkIsloggedIn(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        console.log('User is not logged in. Clearing cart.');
        this.removeCart();
        routes.forEach(route => {
          if (route.path !== 'login') {
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }

  updateQuantity(productId: number, quantity: number): Observable<void> {
    this.checkIsloggedIn();
    const currentCart = this._cart$.value;

    return new Observable<void>(observer => {
      if (currentCart) {
        const item = currentCart.items.find(item => item.productId === productId);
        if (item) {
          item.quantity = quantity;
          this._cart$.next(currentCart);
          this.saveCartToLocalStorage(currentCart);
        }
      }
      observer.next();
      observer.complete();
    });
  }

  getCart(): Observable<Cart | null> {
    this.checkIsloggedIn();
    return this._cart$.asObservable();
  }

  convertToOrder(): Observable<Order | null> {
    this.checkIsloggedIn();
    const currentCart = this._cart$.value;

    return new Observable<Order | null>(observer => {
      if (currentCart) {
        const order: Order = {
          orderItems: currentCart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          }))
        };
        observer.next(order);
        observer.complete();  
      }
    });    
  }
}