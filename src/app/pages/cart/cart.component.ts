import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { CartService } from "../../core/services/cart.service"
import { Cart } from "../../core/models/cart.model"
import { CartItem } from "../../core/models/cartItem.model"
import { OrderService } from "../../core/services/order.service"
import { Order } from "../../core/models/order.model"
import { routes } from "../../app.routes"
@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  cart: Cart | null = null
  subtotal = 0
  tax = 0
  shipping = 5.99
  total = 0
  isLoading = true
  error: string | null = null

  private cartService = inject(CartService)
  private orderService = inject(OrderService)

  ngOnInit(): void {
    this.loadCart()
  }

  loadCart(): void {
    this.isLoading = true
    this.cartService.getCart().subscribe({
      next: (items) => {

        this.cart = items ? items : null    
        // this.calculateTotals()
        this.isLoading = false
      },
      error: (err) => {
        this.error = "Failed to load your cart. Please try again."
        this.isLoading = false
        console.error("Error loading cart:", err)
      },
    })

    console.log("Cart items:", this.cart)
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) return

    this.cartService.updateQuantity(item.product.id, quantity).subscribe({
      next: () => {
        item.quantity = quantity
        // this.calculateTotals()
      },
      error: (err) => {
        console.error("Error updating quantity:", err)
      },
    })
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(productId).subscribe({
      next: () => {
        this.cart = this.cart ? { items: this.cart.items.filter((item) => item.product.id !== productId) } : null
        // this.calculateTotals()
      },
      error: (err) => {
        console.error("Error removing item:", err)
      },
    })
  }

//   calculateTotals(): void {
//     this.subtotal = this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
//     this.tax = this.subtotal * 0.08 // Assuming 8% tax rate
//     this.total = this.subtotal + this.tax + this.shipping
//   }

  checkout(): void {
    console.log("Proceeding to checkout...")
    if (this.cart) {
      this.cartService.convertToOrder().subscribe({
        next: (order) => {
          if (order) {
            this.orderService.createOrder(order).subscribe({
              next: (createdOrder) => {
                console.log("Order created successfully:", createdOrder)
                window.location.href = "/orders"
              },
              error: (err) => {
                console.error("Error creating order:", err)
              }
            })
          } else {
            console.error("Failed to convert cart to order.")
          }
        },
        error: (err) => {
          console.error("Error converting cart to order:", err)
        }
      })
    }
  }
}
