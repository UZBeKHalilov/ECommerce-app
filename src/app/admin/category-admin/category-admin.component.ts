import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './category-admin.component.html',
  styles: [`
    .btn-delete:hover {
      color: #ff4646;
    }
  `]
})
export class CategoryAdminComponent implements OnInit {
  categories: Category[] = [];
  error = '';
  form: any; // FormGroup
  // FormGroup is not imported from @angular/forms, so we use 'any' type for now
  
  constructor(private categoryService: CategoryService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe(categories => this.categories = categories);
  }

  onSubmit() {
    if(this.form.invalid) return;
    this.categoryService.create(this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this.loadCategories();
      },
      error: err => this.error = err.error?.message || 'Error creating category'
    });
  }

  deleteCategory(id: number) {
    this.categoryService.delete(id).subscribe(() => this.loadCategories());
  }
}