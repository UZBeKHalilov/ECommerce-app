// import { Component, type OnInit, inject } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { FormsModule } from "@angular/forms"
// import { RouterModule } from "@angular/router"
// import { CartService } from "../../core/services/cart.service"
// import type { CartItem } from "../../core/models/cart-item.model"

// @Component({
//   selector: "app-cart",
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: "./cart.component.html",
//   styleUrls: ["./cart.component.scss"],
// })
// export class CartComponent implements OnInit {
//   cartItems: CartItem[] = []
//   subtotal = 0
//   tax = 0
//   shipping = 5.99
//   total = 0
//   isLoading = true
//   error: string | null = null

//   private cartService = inject(CartService)

//   ngOnInit(): void {
//     this.loadCart()
//   }

//   loadCart(): void {
//     this.isLoading = true
//     this.cartService.getCart().subscribe({
//       next: (items) => {
//         this.cartItems = items
//         this.calculateTotals()
//         this.isLoading = false
//       },
//       error: (err) => {
//         this.error = "Failed to load your cart. Please try again."
//         this.isLoading = false
//         console.error("Error loading cart:", err)
//       },
//     })
//   }

//   updateQuantity(item: CartItem, quantity: number): void {
//     if (quantity < 1) return

//     this.cartService.updateQuantity(item.product.id, quantity).subscribe({
//       next: () => {
//         item.quantity = quantity
//         this.calculateTotals()
//       },
//       error: (err) => {
//         console.error("Error updating quantity:", err)
//       },
//     })
//   }

//   removeItem(productId: number): void {
//     this.cartService.removeFromCart(productId).subscribe({
//       next: () => {
//         this.cartItems = this.cartItems.filter((item) => item.product.id !== productId)
//         this.calculateTotals()
//       },
//       error: (err) => {
//         console.error("Error removing item:", err)
//       },
//     })
//   }

//   calculateTotals(): void {
//     this.subtotal = this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
//     this.tax = this.subtotal * 0.08 // Assuming 8% tax rate
//     this.total = this.subtotal + this.tax + this.shipping
//   }

//   checkout(): void {
//     // Navigate to checkout or process order
//     console.log("Proceeding to checkout...")
//     // Implement checkout logic or navigation
//   }
// }
