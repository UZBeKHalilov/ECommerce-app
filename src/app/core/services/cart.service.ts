import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Cart } from '../models/cart.model';
import { CartItem } from '../models/cartItem.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { routes } from '../../app.routes';


@Injectable({ providedIn: 'root' })
export class CartService {
  private _cart$ = new BehaviorSubject<Cart | null>(null);

  cart$ = this._cart$.asObservable();

  constructor(private authService: AuthService, private router: Router) {
    // this.checkIsloggedIn();
  }

  private saveCartToLocalStorage(cart: Cart | null): void {
    if (cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }

  private getCartFromLocalStorage(): Cart | null {
    const cartJson = localStorage.getItem('cart');
    return cartJson ? JSON.parse(cartJson) : null;
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
  }

  removeItem(productId: number): void {
    this.checkIsloggedIn();
    const currentCart = this._cart$.value;

    if (currentCart) {
      currentCart.items = currentCart.items.filter(item => item.productId !== productId);
      this._cart$.next(currentCart);
      this.saveCartToLocalStorage(currentCart);
    }
  }

  loadCart(): void {
    this.checkIsloggedIn();
    const cart = this.getCartFromLocalStorage();
    this._cart$.next(cart);
  }

  removeCart(): void {
    this._cart$.next(null);
    localStorage.removeItem('cart');
  }

  checkIsloggedIn(): void {
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
}