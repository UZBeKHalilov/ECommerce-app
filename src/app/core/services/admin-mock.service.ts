import { Injectable } from "@angular/core"
import { type Observable, of, delay, throwError } from "rxjs"
import type { AdminStats, Product, Category, Order, Customer, User } from "../models/admin.model"

@Injectable({
  providedIn: "root",
})
export class AdminMockService {
  private mockProducts: Product[] = [
    {
      id: 1,
      name: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 199.99,
      stock: 25,
      imageUrl: "/placeholder.svg?height=200&width=200",
      categoryId: 1,
      category: { id: 1, name: "Electronics", description: "Electronic devices" },
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Feature-rich smartwatch with health monitoring",
      price: 299.99,
      stock: 5,
      imageUrl: "/placeholder.svg?height=200&width=200",
      categoryId: 1,
      category: { id: 1, name: "Electronics", description: "Electronic devices" },
    },
    {
      id: 3,
      name: "Coffee Mug",
      description: "Ceramic coffee mug with custom design",
      price: 15.99,
      stock: 0,
      imageUrl: "/placeholder.svg?height=200&width=200",
      categoryId: 2,
      category: { id: 2, name: "Home & Kitchen", description: "Home and kitchen items" },
    },
  ]

  private mockCategories: Category[] = [
    { id: 1, name: "Electronics", description: "Electronic devices and gadgets" },
    { id: 2, name: "Home & Kitchen", description: "Home and kitchen items" },
    { id: 3, name: "Clothing", description: "Clothing and accessories" },
  ]

  private mockOrders: Order[] = [
    {
      id: 1,
      customerId: 1,
      customer: {
        userId: 1,
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
        address: "123 Main St",
      },
      orderDate: new Date().toISOString(),
      totalAmount: 199.99,
      paymentStatus: "Completed",
    },
    {
      id: 2,
      customerId: 2,
      customer: {
        userId: 2,
        firstName: "Jane",
        lastName: "Smith",
        phoneNumber: "0987654321",
        address: "456 Oak Ave",
      },
      orderDate: new Date(Date.now() - 86400000).toISOString(),
      totalAmount: 299.99,
      paymentStatus: "Pending",
    },
  ]

  private mockCustomers: Customer[] = [
    {
      userId: 1,
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "1234567890",
      address: "123 Main St",
    },
    {
      userId: 2,
      firstName: "Jane",
      lastName: "Smith",
      phoneNumber: "0987654321",
      address: "456 Oak Ave",
    },
  ]

  private mockUsers: User[] = [
    {
      id: 1,
      username: "john_doe",
      passwordHash: "hashed_password",
      googleId: "",
      email: "john@example.com",
      role: "Customer",
    },
    {
      id: 2,
      username: "jane_smith",
      passwordHash: "hashed_password",
      googleId: "",
      email: "jane@example.com",
      role: "Customer",
    },
    {
      id: 3,
      username: "admin",
      passwordHash: "hashed_password",
      googleId: "",
      email: "admin@example.com",
      role: "Admin",
    },
  ]

  getDashboardStats(): Observable<AdminStats> {
    const stats: AdminStats = {
      totalProducts: this.mockProducts.length,
      totalCategories: this.mockCategories.length,
      totalOrders: this.mockOrders.length,
      totalCustomers: this.mockCustomers.length,
      totalRevenue: this.mockOrders.reduce((sum, order) => sum + order.totalAmount, 0),
      pendingOrders: this.mockOrders.filter((order) => order.paymentStatus === "Pending").length,
      lowStockProducts: this.mockProducts.filter((product) => product.stock < 10).length,
      recentOrders: this.mockOrders.slice(0, 5),
    }

    return of(stats).pipe(delay(500))
  }

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts).pipe(delay(300))
  }

  getProduct(id: number): Observable<Product> {
    const product = this.mockProducts.find((p) => p.id === id)
    if (product) {
      return of(product).pipe(delay(300))
    }
    return throwError(() => new Error("Product not found"))
  }

  createProduct(product: Omit<Product, "id">): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: Math.max(...this.mockProducts.map((p) => p.id)) + 1,
    }
    this.mockProducts.push(newProduct)
    return of(newProduct).pipe(delay(500))
  }

  updateProduct(id: number, productData: Partial<Product>): Observable<Product> {
    const index = this.mockProducts.findIndex((p) => p.id === id)
    if (index !== -1) {
      this.mockProducts[index] = { ...this.mockProducts[index], ...productData }
      return of(this.mockProducts[index]).pipe(delay(500))
    }
    return throwError(() => new Error("Product not found"))
  }

  deleteProduct(id: number): Observable<void> {
    const index = this.mockProducts.findIndex((p) => p.id === id)
    if (index !== -1) {
      this.mockProducts.splice(index, 1)
      return of(void 0).pipe(delay(500))
    }
    return throwError(() => new Error("Product not found"))
  }

  getCategories(): Observable<Category[]> {
    return of(this.mockCategories).pipe(delay(300))
  }

  getCategory(id: number): Observable<Category> {
    const category = this.mockCategories.find((c) => c.id === id)
    if (category) {
      return of(category).pipe(delay(300))
    }
    return throwError(() => new Error("Category not found"))
  }

  createCategory(category: Omit<Category, "id">): Observable<Category> {
    const newCategory: Category = {
      ...category,
      id: Math.max(...this.mockCategories.map((c) => c.id)) + 1,
    }
    this.mockCategories.push(newCategory)
    return of(newCategory).pipe(delay(500))
  }

  updateCategory(id: number, categoryData: Partial<Category>): Observable<Category> {
    const index = this.mockCategories.findIndex((c) => c.id === id)
    if (index !== -1) {
      this.mockCategories[index] = { ...this.mockCategories[index], ...categoryData }
      return of(this.mockCategories[index]).pipe(delay(500))
    }
    return throwError(() => new Error("Category not found"))
  }

  deleteCategory(id: number): Observable<void> {
    const index = this.mockCategories.findIndex((c) => c.id === id)
    if (index !== -1) {
      this.mockCategories.splice(index, 1)
      return of(void 0).pipe(delay(500))
    }
    return throwError(() => new Error("Category not found"))
  }

  getOrders(): Observable<Order[]> {
    return of(this.mockOrders).pipe(delay(300))
  }

  getOrder(id: number): Observable<Order> {
    const order = this.mockOrders.find((o) => o.id === id)
    if (order) {
      return of(order).pipe(delay(300))
    }
    return throwError(() => new Error("Order not found"))
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    const index = this.mockOrders.findIndex((o) => o.id === id)
    if (index !== -1) {
      this.mockOrders[index].paymentStatus = status
      return of(this.mockOrders[index]).pipe(delay(500))
    }
    return throwError(() => new Error("Order not found"))
  }

  getCustomers(): Observable<Customer[]> {
    return of(this.mockCustomers).pipe(delay(300))
  }

  getCustomer(userId: number): Observable<Customer> {
    const customer = this.mockCustomers.find((c) => c.userId === userId)
    if (customer) {
      return of(customer).pipe(delay(300))
    }
    return throwError(() => new Error("Customer not found"))
  }

  getUsers(): Observable<User[]> {
    return of(this.mockUsers).pipe(delay(300))
  }

  getUser(id: number): Observable<User> {
    const user = this.mockUsers.find((u) => u.id === id)
    if (user) {
      return of(user).pipe(delay(300))
    }
    return throwError(() => new Error("User not found"))
  }

  updateUserRole(id: number, role: string): Observable<User> {
    const index = this.mockUsers.findIndex((u) => u.id === id)
    if (index !== -1) {
      this.mockUsers[index].role = role
      return of(this.mockUsers[index]).pipe(delay(500))
    }
    return throwError(() => new Error("User not found"))
  }
}
