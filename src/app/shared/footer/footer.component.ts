import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { LinkifyPipe } from '../../core/pipes/linkify.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, LinkifyPipe],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  categories: Category[] = [];
  
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });
  }

  customerService = [
    { name: 'Contact Us', link: '/contact' },
    { name: 'FAQs', link: '/faqs' },
    { name: 'Shipping Policy', link: '/shipping' },
    { name: 'Return Policy', link: '/returns' },
    { name: 'Track Order', link: '/track-order' }
  ];
  
  aboutUs = [
    { name: 'Our Story', link: '/about' },
    { name: 'Blog', link: '/blog' },
    { name: 'Careers', link: '/careers' },
    { name: 'Press', link: '/press' },
    { name: 'Sustainability', link: '/sustainability' }
  ];
}