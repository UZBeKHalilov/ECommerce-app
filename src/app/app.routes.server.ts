import { RenderMode, ServerRoute } from '@angular/ssr';
import { environment } from '../environments/environment.prod';

async function fetchCategories() {
  const apiUrl = environment.production
    ? `${environment.apiBaseUrl}/categories`
    : 'https://khanx.tech/api/categories'; // Absolute URL for prerendering
  const response = await fetch(apiUrl);
  if (!response.ok) {
    const text = await response.text();
    console.error('API response:', text);
    throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
  }
  const categories = await response.json();
  return categories.map((category: { name: string }) => ({ name: category.name }));
}

async function fetchProducts() {
  const apiUrl = environment.production
    ? `${environment.apiBaseUrl}/v1/products`
    : 'https://khanx.tech/api/v1/products'; // Matches ProductService apiUrl
  const response = await fetch(apiUrl);
  if (!response.ok) {
    const text = await response.text();
    console.error('API response:', text);
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }
  const products = await response.json();
  // Ensure id is a string
  return products.map((product: { id: number | string }) => ({ id: String(product.id) }));
}

export const serverRoutes: ServerRoute[] = [
  {
    path: 'category/:name',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: fetchCategories,
  },
  {
    path: 'product/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: fetchProducts, // Fixed: id is converted to string
  },
  {
    path: '',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{}];
    },
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{}];
    },
  },
  {
    path: 'categories',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: fetchCategories,
  },
  {
    path: 'profile',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{}];
    },
  },
  {
    path: 'orders',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{}];
    },
  },
  {
    path: 'products',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: fetchProducts,
  },
  {
    path: 'admin/categories',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: fetchCategories,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{'**' : 'Default'}]; // Fixed: No parameters for wildcard route
    },
  },
];