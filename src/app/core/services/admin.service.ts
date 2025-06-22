import { Injectable, inject } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"
// import type { AdminStats } from "../models/admin-stats.model"
import type { Product } from "../models/product.model"
import type { Category } from "../models/category.model"
import type { Order } from "../models/order.model"
// import type { Customer } from "../models/customer.model"
import type { User } from "../models/user.model"
import type { OrderItem } from "../models/orderItem.model"
@Injectable({
  providedIn: "root",
})
export class AdminService {
  private readonly apiUrl = "/api" // Replace with your actual API URL
  private http = inject(HttpClient)

  // Dashboard Statistics
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`)
  }

  // Product Management
  getProducts(page?: number, limit?: number, search?: string, categoryId?: number): Observable<Product[]> {
    let params = new HttpParams()
    if (page) params = params.set("page", page.toString())
    if (limit) params = params.set("limit", limit.toString())
    if (search) params = params.set("search", search)
    if (categoryId) params = params.set("categoryId", categoryId.toString())

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params })
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
  }

  createProduct(product: Omit<Product, "id">): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product)
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product)
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`)
  }

  getLowStockProducts(threshold = 10): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/low-stock?threshold=${threshold}`)
  }

  updateProductStock(id: number, stock: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/products/${id}/stock`, { stock })
  }

  // Category Management
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`)
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}`)
  }

  createCategory(category: Omit<Category, "id">): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, category)
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categories/${id}`, category)
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`)
  }

  getCategoryWithProducts(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categories/${id}/products`)
  }

  // Order Management
  getOrders(page?: number, limit?: number, status?: string, customerId?: number): Observable<Order[]> {
    let params = new HttpParams()
    if (page) params = params.set("page", page.toString())
    if (limit) params = params.set("limit", limit.toString())
    if (status) params = params.set("status", status)
    if (customerId) params = params.set("customerId", customerId.toString())

    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { params })
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`)
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/orders/${id}/status`, { paymentStatus: status })
  }

  getOrderItems(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.apiUrl}/orders/${orderId}/items`)
  }

  getPendingOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/pending`)
  }

  getRecentOrders(limit = 10): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/recent?limit=${limit}`)
  }

  getOrdersByDateRange(startDate: string, endDate: string): Observable<Order[]> {
    const params = new HttpParams().set("startDate", startDate).set("endDate", endDate)

    return this.http.get<Order[]>(`${this.apiUrl}/orders/date-range`, { params })
  }

  // Customer Management
  // getCustomers(page?: number, limit?: number, search?: string): Observable<Customer[]> {
  //   let params = new HttpParams()
  //   if (page) params = params.set("page", page.toString())
  //   if (limit) params = params.set("limit", limit.toString())
  //   if (search) params = params.set("search", search)

  //   return this.http.get<Customer[]>(`${this.apiUrl}/customers`, { params })
  // }

  // getCustomer(userId: number): Observable<Customer> {
  //   return this.http.get<Customer>(`${this.apiUrl}/customers/${userId}`)
  // }

  // getCustomerOrders(userId: number): Observable<Order[]> {
  //   return this.http.get<Order[]>(`${this.apiUrl}/customers/${userId}/orders`)
  // }

  // updateCustomer(userId: number, customer: Partial<Customer>): Observable<Customer> {
  //   return this.http.put<Customer>(`${this.apiUrl}/customers/${userId}`, customer)
  // }

  // User Management
  getUsers(page?: number, limit?: number, role?: string): Observable<User[]> {
    let params = new HttpParams()
    if (page) params = params.set("page", page.toString())
    if (limit) params = params.set("limit", limit.toString())
    if (role) params = params.set("role", role)

    return this.http.get<User[]>(`${this.apiUrl}/users`, { params })
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`)
  }

  updateUserRole(id: number, role: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}/role`, { role })
  }

  createUser(user: Omit<User, "id">): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user)
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user)
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`)
  }

  resetUserPassword(id: number, newPassword: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/users/${id}/reset-password`, { newPassword })
  }

  // Analytics and Reports
  getSalesReport(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams().set("startDate", startDate).set("endDate", endDate)

    return this.http.get(`${this.apiUrl}/reports/sales`, { params })
  }

  getProductSalesReport(productId?: number): Observable<any> {
    const params = productId ? new HttpParams().set("productId", productId.toString()) : new HttpParams()
    return this.http.get(`${this.apiUrl}/reports/product-sales`, { params })
  }

  getCustomerReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/customers`)
  }

  getInventoryReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/inventory`)
  }

  // Bulk Operations
  bulkUpdateProducts(updates: { id: number; data: Partial<Product> }[]): Observable<Product[]> {
    return this.http.patch<Product[]>(`${this.apiUrl}/products/bulk-update`, { updates })
  }

  bulkDeleteProducts(productIds: number[]): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/bulk-delete`, {
      body: { productIds },
    })
  }

  bulkUpdateOrderStatus(orderIds: number[], status: string): Observable<Order[]> {
    return this.http.patch<Order[]>(`${this.apiUrl}/orders/bulk-update-status`, {
      orderIds,
      paymentStatus: status,
    })
  }

  // File Upload (for product images)
  uploadProductImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData()
    formData.append("image", file)

    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload/product-image`, formData)
  }

  // Search functionality
  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/search/products?q=${encodeURIComponent(query)}`)
  }

  // searchCustomers(query: string): Observable<Customer[]> {
  //   return this.http.get<Customer[]>(`${this.apiUrl}/search/customers?q=${encodeURIComponent(query)}`)
  // }

  searchOrders(query: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/search/orders?q=${encodeURIComponent(query)}`)
  }

  // System Settings
  getSystemSettings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/settings`)
  }

  updateSystemSettings(settings: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/settings`, settings)
  }

  // Backup and Export
  exportProducts(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/products`, {
      responseType: "blob",
    })
  }

  exportOrders(startDate?: string, endDate?: string): Observable<Blob> {
    let params = new HttpParams()
    if (startDate) params = params.set("startDate", startDate)
    if (endDate) params = params.set("endDate", endDate)

    return this.http.get(`${this.apiUrl}/export/orders`, {
      params,
      responseType: "blob",
    })
  }

  exportCustomers(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/customers`, {
      responseType: "blob",
    })
  }

  // Notifications
  getAdminNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications`)
  }

  markNotificationAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/notifications/${id}/read`, {})
  }

  // Activity Logs
  getActivityLogs(page?: number, limit?: number): Observable<any[]> {
    let params = new HttpParams()
    if (page) params = params.set("page", page.toString())
    if (limit) params = params.set("limit", limit.toString())

    return this.http.get<any[]>(`${this.apiUrl}/activity-logs`, { params })
  }
}
