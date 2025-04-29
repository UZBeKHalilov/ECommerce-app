import { Component, OnInit } from '@angular/core';
import { CartService } from '../core/services/cart.service';
import { Cart } from '../core/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: [`
    .btn-remove:hover {
      color: #ff4646;
    }
  `]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(c => this.cart = c);
    this.cartService.loadCart();
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId).subscribe();
  }

  getTotal(): number {
    if(!this.cart) return 0;
    return this.cart.items.reduce((acc, cur) => acc + cur.product.price * cur.quantity, 0);
  }
}