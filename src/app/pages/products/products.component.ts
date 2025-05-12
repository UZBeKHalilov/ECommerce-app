import { Component, type OnInit, inject, type AfterViewInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { ProductService } from "../../core/services/product.service"
import { CategoryService } from "../../core/services/category.service"
import { CartService } from "../../core/services/cart.service"
import type { Product } from "../../core/models/product.model"
import type { Category } from "../../core/models/category.model"

@Component({
  selector: "app-products",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit, AfterViewInit {
  categories: Category[] = []
  productsByCategory: Map<number, Product[]> = new Map()
  isLoading = true
  error: string | null = null

  private productService = inject(ProductService)
  private categoryService = inject(CategoryService)
  private cartService = inject(CartService)

  ngOnInit(): void {
    this.loadCategories()
  }

  ngAfterViewInit(): void {
    this.setupScrollButtons()
  }

  loadCategories(): void {
    this.isLoading = true
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories
        this.loadProductsByCategory()
      },
      error: (err) => {
        this.error = "Failed to load categories. Please try again."
        this.isLoading = false
        console.error("Error loading categories:", err)
      },
    })
  }

  loadProductsByCategory(): void {
    const requests = this.categories.map((category) =>
      this.productService.getAllByCategoryId(category.id).subscribe({
        next: (products) => {
          this.productsByCategory.set(category.id, products)
        },
        error: (err) => {
          console.error(`Error loading products for category ${category.name}:`, err)
        },
      }),
    )

    // When all requests are complete
    Promise.all(requests).finally(() => {
      this.isLoading = false
    })
  }

  addToCart(product: Product): void {
    // this.cartService.addToCart(product.id, 1).subscribe({
    //   next: () => {
    //     console.log(`Added ${product.name} to cart`)
    //     // You could add a toast notification here
    //   },
    //   error: (err) => {
    //     console.error("Error adding to cart:", err)
    //   },
    // })
    if (product) {
      // This would call your cart service
      console.log('Adding to cart:', product);
      this.cartService.addToCart(product, 1);

      // Show success message
      const successMessage = document.getElementById('success-message');
      if (successMessage) {
        successMessage.classList.remove('hidden');
        setTimeout(() => {
          successMessage.classList.add('hidden');
        }, 3000);
      }
    }
  }

  getProductsForCategory(categoryId: number): Product[] {
    return this.productsByCategory.get(categoryId) || []
  }

  trackByCategory(index: number, category: Category): number {
    return category.id
  }

  trackByProduct(index: number, product: Product): number {
    return product.id
  }

  setupScrollButtons(): void {
    setTimeout(() => {
      const leftButtons = document.querySelectorAll(".scroll-button-left")
      const rightButtons = document.querySelectorAll(".scroll-button-right")

      leftButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const targetId = button.getAttribute("data-target")
          const container = document.getElementById(targetId as string)
          if (container) {
            container.scrollBy({ left: -300, behavior: "smooth" })
          }
        })
      })

      rightButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const targetId = button.getAttribute("data-target")
          const container = document.getElementById(targetId as string)
          if (container) {
            container.scrollBy({ left: 300, behavior: "smooth" })
          }
        })
      })
    }, 500) // Small delay to ensure DOM is ready
  }

  
}
