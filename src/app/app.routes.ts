import { Routes } from '@angular/router';

import { ProductsComponent } from './pages/products/products.component';
import { CategoryAdminComponent } from './admin/category-admin/category-admin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AuthComponent } from './pages/auth/auth.component';



export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: AuthComponent },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: "profile",
    loadComponent: () => import("./pages/profile/profile.component").then((m) => m.ProfileComponent),
  },
  { path: 'orders', component: OrdersComponent },
  { path: 'category/:name', component: CategoryComponent, },
  { path: 'product/:id', component: ProductComponent, },
  { path: 'products', component: ProductsComponent },
  { path: '**', component: NotFoundComponent },
  // Add admin panel & guards routes here
  { path: 'admin/categories', component: CategoryAdminComponent },
];