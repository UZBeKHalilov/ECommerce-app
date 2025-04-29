import { Routes } from '@angular/router';

import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './orders/checkout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CategoryAdminComponent } from './admin/category-admin/category-admin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category/:name', component: CategoryComponent, },
  { path: 'product/:id', component: ProductComponent, },
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: NotFoundComponent },
  // Add admin panel & guards routes here
  { path: 'admin/categories', component: CategoryAdminComponent },
];