import { Component, OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms"
import { AdminServiceProvider } from "../../core/services/admin.service.provider"
import { AdminStats, Product, Category, Order, Customer, User } from "../../core/models/admin.model"
import { ProductService } from "../../core/services/product.service"

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
  activeSection: "dashboard" | "products" | "categories" | "orders" | "customers" | "users" = "dashboard"

  // Dashboard data
  stats: AdminStats | null = null

  // Products data
  products: Product[] = []
  filteredProducts: Product[] = []
  productForm: FormGroup
  editingProduct: Product | null = null
  showProductModal = false

  // Categories data
  categories: Category[] = []
  categoryForm: FormGroup
  editingCategory: Category | null = null
  showCategoryModal = false

  // Orders data
  orders: Order[] = []
  filteredOrders: Order[] = []
  selectedOrder: Order | null = null
  showOrderModal = false

  // Customers data
  customers: Customer[] = []
  filteredCustomers: Customer[] = []
  selectedCustomer: Customer | null = null
  showCustomerModal = false

  // Users data
  users: User[] = []
  filteredUsers: User[] = []
  userForm: FormGroup
  editingUser: User | null = null
  showUserModal = false

  // Loading states
  isLoading = true
  isSubmitting = false

  // Messages
  error: string | null = null
  successMessage: string | null = null

  // Search and filters
  productSearchTerm = ""
  selectedCategoryFilter = ""
  orderStatusFilter = ""
  customerSearchTerm = ""
  userRoleFilter = ""

  private adminServiceProvider = inject(AdminServiceProvider)
  private adminService = this.adminServiceProvider.getService()
  private fb = inject(FormBuilder)
  // private productService = inject(ProductService)
  constructor() {
    this.productForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      description: ["", Validators.maxLength(1000)],
      price: ["", [Validators.required, Validators.min(0)]],
      stock: ["", [Validators.required, Validators.min(0)]],
      imageUrl: [""],
      categoryId: ["", Validators.required],
    })

    this.categoryForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
    })

    this.userForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      role: ["Customer", Validators.required],
    })
  }

  ngOnInit(): void {
    this.loadDashboardStats()
    this.loadCategories()
  }

  // Navigation
  setActiveSection(section: "dashboard" | "products" | "categories" | "orders" | "customers" | "users"): void {
    this.activeSection = section
    this.clearMessages()

    switch (section) {
      case "dashboard":
        this.loadDashboardStats()
        break
      case "products":
        this.loadProducts()
        break
      case "categories":
        this.loadCategories()
        break
      case "orders":
        this.loadOrders()
        break
      case "customers":
        this.loadCustomers()
        break
      case "users":
        this.loadUsers()
        break
    }
  }

  clearMessages(): void {
    this.error = null
    this.successMessage = null
  }

  // Dashboard methods
  loadDashboardStats(): void {
    this.isLoading = true
    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats
        this.isLoading = false
      },
      error: (err) => {
        this.error = "Failed to load dashboard statistics"
        this.isLoading = false
        console.error("Error loading admin stats:", err)
      },
    })
  }

  // Product methods
  loadProducts(): void {
    this.isLoading = true
    const products$ = this.adminService.getProducts()
    if (products$ && typeof (products$ as any).subscribe === "function") {
      (products$ as any).subscribe({
        next: (products: Product[]) => {
          this.products = products
          this.filteredProducts = products
          this.isLoading = false
        },
        error: (err: any) => {
          this.error = "Failed to load products"
          this.isLoading = false
          console.error("Error loading products:", err)
        },
      })
    } else {
      this.error = "Failed to load products: Service did not return an Observable."
      this.isLoading = false
    }
  }

  getProductCountByCategory(categoryId: number): number {
    return this.products.filter((p) => p.categoryId === categoryId).length
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(this.productSearchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.productSearchTerm.toLowerCase())
      const matchesCategory =
        !this.selectedCategoryFilter || product.categoryId.toString() === this.selectedCategoryFilter
      return matchesSearch && matchesCategory
    })
  }

  openProductModal(product?: Product): void {
    this.editingProduct = product || null
    this.showProductModal = true
    this.clearMessages()

    if (product) {
      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
      })
    } else {
      this.productForm.reset()
    }
  }

  closeProductModal(): void {
    this.showProductModal = false
    this.editingProduct = null
    this.productForm.reset()
  }

  onProductSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true
    const productData = this.productForm.value

    const request: import("rxjs").Observable<any> = this.editingProduct
      ? this.adminService.updateProduct(this.editingProduct.id, productData)
      : this.adminService.createProduct(productData)

    request.subscribe({
      next: () => {
        this.isSubmitting = false
        this.successMessage = this.editingProduct ? "Product updated successfully!" : "Product created successfully!"
        this.closeProductModal()
        this.loadProducts()
      },
      error: (err) => {
        this.isSubmitting = false
        this.error = err.message || "Failed to save product"
        console.error("Error saving product:", err)
      },
    })
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.adminService.deleteProduct(product.id).subscribe({
        next: () => {
          this.successMessage = "Product deleted successfully!"
          this.loadProducts()
        },
        error: (err) => {
          this.error = "Failed to delete product"
          console.error("Error deleting product:", err)
        },
      })
    }
  }

  // Category methods
  loadCategories(): void {
    this.adminService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories
        if (this.activeSection === "categories") {
          this.isLoading = false
        }
      },
      error: (err) => {
        this.error = "Failed to load categories"
        if (this.activeSection === "categories") {
          this.isLoading = false
        }
        console.error("Error loading categories:", err)
      },
    })
  }

  openCategoryModal(category?: Category): void {
    this.editingCategory = category || null
    this.showCategoryModal = true
    this.clearMessages()

    if (category) {
      this.categoryForm.patchValue({
        name: category.name,
        description: category.description,
      })
    } else {
      this.categoryForm.reset()
    }
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false
    this.editingCategory = null
    this.categoryForm.reset()
  }

  onCategorySubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true
    const categoryData = this.categoryForm.value

    const request = this.editingCategory
      ? this.adminService.updateCategory(this.editingCategory.id, categoryData)
      : this.adminService.createCategory(categoryData)

    request.subscribe({
      next: () => {
        this.isSubmitting = false
        this.successMessage = this.editingCategory ? "Category updated successfully!" : "Category created successfully!"
        this.closeCategoryModal()
        this.loadCategories()
      },
      error: (err) => {
        this.isSubmitting = false
        this.error = err.message || "Failed to save category"
        console.error("Error saving category:", err)
      },
    })
  }

  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.adminService.deleteCategory(category.id).subscribe({
        next: () => {
          this.successMessage = "Category deleted successfully!"
          this.loadCategories()
        },
        error: (err) => {
          this.error = "Failed to delete category"
          console.error("Error deleting category:", err)
        },
      })
    }
  }

  // Order methods
  loadOrders(): void {
    this.isLoading = true
    const orders$ = this.adminService.getOrders()
    if (orders$ && typeof (orders$ as any).subscribe === "function") {
      (orders$ as any).subscribe({
        next: (orders: Order[]) => {
          this.orders = orders
          this.filteredOrders = orders
          this.isLoading = false
        },
        error: (err: any) => {
          this.error = "Failed to load orders"
          this.isLoading = false
          console.error("Error loading orders:", err)
        },
      })
    } else {
      this.error = "Failed to load orders: Service did not return an Observable."
      this.isLoading = false
    }
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter((order) => {
      return !this.orderStatusFilter || order.paymentStatus === this.orderStatusFilter
    })
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order
    this.showOrderModal = true
  }

  closeOrderModal(): void {
    this.showOrderModal = false
    this.selectedOrder = null
  }

  updateOrderStatus(order: Order, status: string): void {
    const updateOrderStatus$ = this.adminService.updateOrderStatus(order.id, status)
    if (updateOrderStatus$ && typeof (updateOrderStatus$ as any).subscribe === "function") {
      (updateOrderStatus$ as any).subscribe({
        next: (): void => {
          this.successMessage = "Order status updated successfully!"
          this.loadOrders()
          if (this.selectedOrder && this.selectedOrder.id === order.id) {
        this.selectedOrder.paymentStatus = status
          }
        },
        error: (err: any): void => {
          this.error = "Failed to update order status"
          console.error("Error updating order status:", err)
        },
      } as {
        next: () => void
        error: (err: any) => void
      })
    } else {
      this.error = "Failed to update order status: Service did not return an Observable."
    }
  }

  // Customer methods
  loadCustomers(): void {
    this.isLoading = true
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.customers = users as any
        this.filteredCustomers = users as any
        this.isLoading = false
      },
      error: (err) => {
        this.error = "Failed to load customers"
        this.isLoading = false
        console.error("Error loading customers:", err)
      },
    })
  }

  filterCustomers(): void {
    this.filteredCustomers = this.customers.filter((customer) => {
      const searchTerm = this.customerSearchTerm.toLowerCase()
      return (
        customer.firstName.toLowerCase().includes(searchTerm) ||
        customer.lastName.toLowerCase().includes(searchTerm) ||
        customer.user?.email.toLowerCase().includes(searchTerm)
      )
    })
  }

  viewCustomerDetails(customer: Customer): void {
    this.selectedCustomer = customer
    this.showCustomerModal = true
  }

  closeCustomerModal(): void {
    this.showCustomerModal = false
    this.selectedCustomer = null
  }

  // User methods
  loadUsers(): void {
    this.isLoading = true
    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users.map((user: any) => ({
          ...user,
          googleId: user.googleId ?? "",
        }))
        this.filteredUsers = this.users
        this.isLoading = false
      },
      error: (err) => {
        this.error = "Failed to load users"
        this.isLoading = false
        console.error("Error loading users:", err)
      },
    })
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter((user) => {
      return !this.userRoleFilter || user.role === this.userRoleFilter
    })
  }

  openUserModal(user?: User): void {
    this.editingUser = user || null
    this.showUserModal = true
    this.clearMessages()

    if (user) {
      this.userForm.patchValue({
        username: user.username,
        email: user.email,
        role: user.role,
      })
    } else {
      this.userForm.reset()
      this.userForm.patchValue({ role: "Customer" })
    }
  }

  closeUserModal(): void {
    this.showUserModal = false
    this.editingUser = null
    this.userForm.reset()
  }

  onUserSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched()
      return
    }

    // this.isSubmitting = true
    // const userData = this.userForm.value

    // const request = this.editingUser
    //   ? this.adminService.updateUser(this.editingUser.id, userData)
    //   : this.adminService.createUser({ ...userData, passwordHash: "temp_hash", googleId: "" })

    // request.subscribe({
    //   next: () => {
    //     this.isSubmitting = false
    //     this.successMessage = this.editingUser ? "User updated successfully!" : "User created successfully!"
    //     this.closeUserModal()
    //     this.loadUsers()
    //   },
    //   error: (err) => {
    //     this.isSubmitting = false
    //     this.error = err.message || "Failed to save user"
    //     console.error("Error saving user:", err)
    //   },
    // })
  }

  updateUserRole(user: User, role: string): void {
    this.adminService.updateUserRole(user.id, role).subscribe({
      next: () => {
        this.successMessage = "User role updated successfully!"
        this.loadUsers()
      },
      error: (err) => {
        this.error = "Failed to update user role"
        console.error("Error updating user role:", err)
      },
    })
  }

  // Utility methods
  getCategoryName(categoryId: number): string {
    const category = this.categories.find((c) => c.id === categoryId)
    return category?.name || "Unknown"
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return "Out of Stock"
    if (stock < 10) return "Low Stock"
    return "In Stock"
  }

  getStockStatusClass(stock: number): string {
    if (stock === 0) return "bg-red-500 text-red-900"
    if (stock < 10) return "bg-yellow-500 text-yellow-900"
    return "bg-green-500 text-green-900"
  }

  getOrderStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500 text-yellow-900"
      case "completed":
        return "bg-green-500 text-green-900"
      case "failed":
        return "bg-red-500 text-red-900"
      default:
        return "bg-gray-500 text-gray-900"
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
}
