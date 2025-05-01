import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: Category | null = null;
  products: Product[] = [];
  loading: boolean = true;
  error: string | null = null;

  sortOptions = [
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'price_desc', label: 'Price (High to Low)' }
  ];

  selectedSort: string = 'name_asc';
  inStockOnly: boolean = false;
  isStockChanged: boolean = false; // Placeholder for category name

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const categoryName = params['name'];
      if (categoryName) {
        this.loadCategory(categoryName);
      }
    });
  }

  loadCategory(categoryName: string): void {
    this.loading = true;
    this.error = null;

    this.categoryService.getCategoryByName(categoryName).subscribe({
      next: (category) => {
        this.category = category;
        this.loadProducts(category.id);
      },
      error: (err) => {
        this.error = 'Failed to load category. Please try again.';
        this.loading = false;
        console.error('Error loading category:', err);
      }
    });
  }

  loadProducts(categoryId: number): void {
    this.productService.getAllByCategoryId(categoryId).subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  applyFilters(): void {
    const callerFunction = new Error().stack?.split('\n')[2]?.trim();
    console.log('applyFilters() was called by:', callerFunction);
    let filteredProducts = [...this.products];

    // Apply in-stock filter
    if (this.inStockOnly) {
      filteredProducts = filteredProducts.filter(product => product.stock > 0);
    } else {
      console.log('In stock only filter is off, showing all products.');
      this.isStockChanged = false; // Reset the stock change flag

      if (this.category && this.category.id) {
        this.loadProducts(this.category.id); // Reload products to show all
      } else {
        console.log('Category ID is not available, showing old products.');
      }
      filteredProducts = [...this.products];
    }


    // Apply sorting
    switch (this.selectedSort) {
      case 'name_asc':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
    }

    this.products = filteredProducts;
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onInStockChange(): void {
    this.isStockChanged = !this.inStockOnly;

    if (this.isStockChanged) {
      this.inStockOnly = false;
    }

    this.applyFilters();
  }

  addToCart(product: Product): void {
    // This would call your cart service
    console.log('Adding to cart:', product);
    // Example: this.cartService.addToCart(product, 1);

    // Show a temporary success message
    const productElement = document.getElementById(`product-${product.id}`);
    if (productElement) {
      const message = document.createElement('div');
      message.className = 'absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm';
      message.textContent = 'Added to cart!';
      productElement.appendChild(message);

      setTimeout(() => {
        message.remove();
      }, 2000);
    }
  }
}