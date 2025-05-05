import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, MaterialModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  // For the featured categories section
  featuredCategories: Category[] = [];
  
  // For the category grid layout
  breakpoint: number = 4;
  
  constructor(private categoryService: CategoryService) {}
  
  ngOnInit(): void {
    this.loadCategories();
    this.setGridBreakpoint(window.innerWidth);
  }
  
  onResize(event: any): void {
    this.setGridBreakpoint(event.target.innerWidth);
  }
  
  setGridBreakpoint(width: number): void {
    if (width <= 576) {
      this.breakpoint = 1;
    } else if (width <= 768) {
      this.breakpoint = 2;
    } else if (width <= 992) {
      this.breakpoint = 3;
    } else {
      this.breakpoint = 4;
    }
  }
  
  loadCategories(): void {
    this.loading = true;
    this.error = null;
    
    this.categoryService.getAll().subscribe({
      next: (categories: Category[]) => {
      this.categories = categories;
      
      // Select a few categories as featured (in a real app, this might come from the API)
      if (categories.length > 0) {
        this.featuredCategories = categories.slice(0, 3);
      }
      
      this.loading = false;
      },
      error: (err: any) => {
      this.error = 'Failed to load categories. Please try again.';
      this.loading = false;
      console.error('Error loading categories:', err);
      }
    });
  }
  
  // Helper method to generate a background gradient based on category name
  // This creates a unique but consistent color for each category
  getCategoryColor(name: string): string {
    // Simple hash function to generate a number from a string
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Generate hue from 120 (green) to 160 (blue-green)
    const hue = 120 + (Math.abs(hash) % 40);
    
    return `linear-gradient(135deg, hsl(${hue}, 70%, 20%), hsl(${hue}, 70%, 10%))`;
  }
}