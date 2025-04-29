import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { OrderService } from '../core/services/order.service';
import { CartService } from "../core/services/cart.service";
import { Cart } from "../core/models/cart.model";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styles: [`
    .btn-checkout:hover { background-color: #1f7a1f !important; }
  `]
})
export class CheckoutComponent implements OnInit {
  stripe: Stripe | null = null;
  cart: Cart | null = null;
  loading = false;
  message = '';
  orderTotal: number = 0;

  private stripePublishableKey = 'pk_test_YourStripePublishableKeyHere'; // Put your Stripe key

  constructor(private orderService: OrderService, private cartService: CartService) {}

  ngOnInit() {
    this.loadStripe();
    this.cartService.cart$.subscribe(c => this.cart = c);
    this.cartService.loadCart();
  }

  async loadStripe() {
    this.stripe = await loadStripe(this.stripePublishableKey);
  }

  checkout() {
    if (!this.cart || this.cart.items.length === 0) {
      this.message = 'Cart is empty.';
      return;
    }
    this.loading = true;
    // Call backend to create an order and session
    this.orderService.createOrder().subscribe({
      next: order => {
        // For simplicity assuming backend returns Stripe sessionId in real implementation
        // Actual Stripe checkout requires server integration to create session
        alert('Order created with total: $' + order.total.toFixed(2));
        this.message = 'Order created! Implement Stripe server-side integration for payment.';
        this.loading = false;
      },
      error: err => {
        this.message = 'Error creating order: ' + (err.error?.message || err.statusText);
        this.loading = false;
      }
    });
  }
}