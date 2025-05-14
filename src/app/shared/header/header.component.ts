import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { CategoryService } from '../../core/services/category.service';
// import { Category } from '../../core/models/category.model';
import { LinkifyPipe } from '../../core/pipes/linkify.pipe';
import { AuthService } from '../../core/services/auth.service';
import { MaterialModule } from '../../material.module';
import { AsyncPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { FormsModule } from '@angular/forms';
import { SearchFilterPipe } from '../../core/pipes/search-filter.pipe';

import { Product } from '../../core/models/product.model';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MaterialModule, AsyncPipe, FormsModule, SearchFilterPipe, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMenuOpen = false;
  isUserMenuOpen = false;
  cartItemsCount$: Observable<number> = new Observable<number>();

  // categories: Category[] = [];
  products: Product[] = [];
  searchText: string = '';
  isSearching: boolean = false;

  constructor(private authService: AuthService, private cartService: CartService, private productService: ProductService) {
    this.cartItemsCount$ = this.cartService.cartItemsCount$;
  }

  ngOnInit(): void {
    // this.categoryService.getAll().subscribe(categories => {
    //   this.categories = categories;
    // });
    this.productService.getAll().subscribe(products => {
      this.products = products;
    });    
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.authService.isLoggedIn$;
  }
  
  isAdmin(): Observable<boolean> {
    return this.authService.isAdmin$;
  }

  logout(): void {
    console.log('Logging out...');
    this.authService.logout();
    this.isMenuOpen = false;
    this.isUserMenuOpen = false;
    console.log('Logged out from Header!');
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isUserMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  onSearchbarFocus(): void {
    this.isSearching = true;
  }

  onSearchbarBlur(): void {
    this.isSearching = false;
  }
}