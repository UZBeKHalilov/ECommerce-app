export interface Category {
  id: number
  name: string
  description: string
  products?: Product[]
}

export interface Customer {
  userId: number
  firstName: string
  lastName: string
  phoneNumber: string
  address: string
  user?: User
}

export interface Order {
  id: number
  customerId: number
  customer?: Customer
  orderDate: string
  totalAmount: number
  paymentStatus: string
  orderItems?: OrderItem[]
}

export interface OrderItem {
  id: number
  orderId: number
  order?: Order
  productId: number
  product?: Product
  quantity: number
  price: number
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
  categoryId: number
  category?: Category
}

export interface User {
  id: number
  username: string
  passwordHash: string
  googleId: string
  email: string
  role: string
  customer?: Customer
}

export interface AdminStats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalCustomers: number
  totalRevenue: number
  pendingOrders: number
  lowStockProducts: number
  recentOrders: Order[]
}
