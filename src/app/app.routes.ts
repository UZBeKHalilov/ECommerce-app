import { Routes } from '@angular/router';

import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './orders/checkout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CategoryAdminComponent } from './admin/category-admin/category-admin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/categories', component: CategoryAdminComponent },
  { path: '**', component: NotFoundComponent },
  // Add admin panel & guards routes here
];