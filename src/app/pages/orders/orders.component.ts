import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { OrderService } from "../../core/services/order.service"
import type { Order } from "../../core/models/order.model"

@Component({
  selector: "app-orders",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = []
  selectedOrder: Order | null = null
  isLoading = true
  error: string | null = null

  private orderService = inject(OrderService)

  ngOnInit(): void {
    this.loadOrders()
  }

  loadOrders(): void {
    this.isLoading = true
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders
        this.isLoading = false
      },
      error: (err) => {
        this.error = "Failed to load your orders. Please try again."
        this.isLoading = false
        console.error("Error loading orders:", err)
      },
    })
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order
  }

  closeOrderDetails(): void {
    this.selectedOrder = null
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-yellow-500 text-yellow-900"
      case "shipped":
        return "bg-blue-500 text-blue-900"
      case "delivered":
        return "bg-green-500 text-green-900"
      case "cancelled":
        return "bg-red-500 text-red-900"
      default:
        return "bg-gray-500 text-gray-900"
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}
