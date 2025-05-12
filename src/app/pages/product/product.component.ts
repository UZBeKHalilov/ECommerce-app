import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: Product | null = null;
  loading: boolean = true;
  error: string | null = null;
  quantity: number = 1;
  relatedProducts: Product[] = [];
  activeImageIndex: number = 0;
  
  // Simulating multiple product images
  productImages: string[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id']; // Convert to number
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }
  
  loadProduct(productId: number): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getById(productId).subscribe({
      next: (product) => {
        this.product = product;
        
        // Simulate multiple product images (in a real app, these would come from the API)
        this.productImages = [
          product.imageUrl,
          // Add placeholder images for demo purposes
          // `/assets/images/products/placeholder-1.jpg`,
          // `/assets/images/products/placeholder-2.jpg`
        ];
        this.loadRelatedProducts(product.categoryId);
        this.loading = false;

        // Trigger change detection to update the view
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product. Please try again.';
        this.loading = false;
        console.error('Error loading product:', err);
      }
    });
  }
  
  loadRelatedProducts(categoryId: number): void {
    this.productService.getAllByCategoryId(categoryId).subscribe({
      next: (products) => {
        // Filter out the current product and limit to 4 related products
        this.relatedProducts = products
          .filter(p => p.id !== this.product?.id)
          .slice(0, 4);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading related products:', err);
      }
    });
  }
  
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  
  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }
  
  addToCart(): void {
    if (this.product) {
      // This would call your cart service
      this.cartService.addToCart(this.product, this.quantity);

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
  
  setActiveImage(index: number): void {
    this.activeImageIndex = index;
  }
}