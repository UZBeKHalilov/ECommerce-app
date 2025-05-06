import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { LinkifyPipe } from '../../core/pipes/linkify.pipe';
import { AuthService } from '../../core/services/auth.service';
import { MaterialModule } from '../../material.module';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, LinkifyPipe, MaterialModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMenuOpen = false;
  isUserMenuOpen = false;
  
  categories: Category[] = [];

  constructor(private categoryService: CategoryService, private authService: AuthService) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
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
}