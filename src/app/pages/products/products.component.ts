import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../core/models/category.model';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  categories: Category[] = [];
  selectedCategoryId: number | null = null;
  products: Product[] = [];
  loading = false;

  constructor(private categoryService: CategoryService, private productService: ProductService) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });
    this.loadProducts();
  }

  onCategorySelect(id: number | null) {
    this.selectedCategoryId = id;
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll(this.selectedCategoryId || undefined).subscribe(products => {
      this.products = products;
      this.loading = false;
    });
  }
}