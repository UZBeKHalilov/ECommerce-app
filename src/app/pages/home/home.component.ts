import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { LinkifyPipe } from '../../core/pipes/linkify.pipe';

import { Category } from '../../core/models/category.model';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, LinkifyPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  products: Product[] = [];
  categories: Category[] = [];
  testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'I love supporting small businesses through this marketplace. The quality of the products is exceptional and the customer service is outstanding!',
      role: 'Regular Customer',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_4D0qaxkn-lzKDQ_s6-l_9cfqYen2KKKBOw&s'
    },
    {
      name: 'Michael Chen',
      text: 'As a small business owner, this platform has helped me reach new customers and grow my brand. The seller tools are intuitive and powerful.',
      role: 'Seller',
      image: 'https://media.licdn.com/dms/image/v2/D4E03AQEzVlms_M0dlQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718249494391?e=2147483647&v=beta&t=oRdFFlqViigeSyKdE3bYHO_df4dA5PEYD-2mCKEcwG8'
    }
  ];

  selectedCategoryId: number | null = null;
  loading = false;

  constructor(private categoryService: CategoryService, private productService: ProductService) { }

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