import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = '/api/v1/products';
  private apiUrlv2 = '/api/v2/productsV';

  constructor(private http: HttpClient) { }

  // getAll(categoryId?: number): Observable<Product[]> {
  //   let params = new HttpParams();
  //   if (categoryId) {
  //     params = params.set('categoryId', categoryId.toString());
  //   }
  //   return this.http.get<Product[]>(this.apiUrl, { params }).pipe(
  //     map(products => 
  //       products.map(product => ({
  //         ...product,
  //         imageUrls: product.imageUrl && product.imageUrl.length > 0 
  //           ? product.imageUrl 
  //           : ['../../../assets/images/default-image.png']
  //       }))
  //     )
  //   );
  // }

  getAll(categoryId?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }

    return this.fixProductsImageUrl(this.http.get<Product[]>(this.apiUrl, { params }));
  }

  getAllByCategoryId(categoryId: number): Observable<Product[]> {

    return this.fixProductsImageUrl(this.http.get<Product[]>(`${this.apiUrlv2}/${categoryId}`));
  }

  getById(id: number): Observable<Product> {
    return this.fixProductImageUrl(this.http.get<Product>(`${this.apiUrl}/${id}`));
  }

  

  create(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  update(id: number, product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Fix image URL if it is not set
  // This method is not used in the current implementation
  fixProductsImageUrl(products: Observable<Product[]>): Observable<Product[]> {

    if (!products) {
      console.log('Products is null or undefined');
      return products;
    }

    return products.pipe(
      map(productList => {
        productList.forEach(product => {
          if (!product.imageUrl || product.imageUrl.length === 0) {
            product.imageUrl = 'assets/images/default-image.png';
          }
        });
        return productList;
      })
    );
  }

  fixProductImageUrl(product: Observable<Product>): Observable<Product> {
    if (!product) {
      console.log('Product is null or undefined');
      return product;
    }

    return product.pipe(
      map(product => {
        if (!product.imageUrl || product.imageUrl.length === 0) {
          product.imageUrl = 'assets/images/default-image.png';
        }
        return product;
      })
    );
  }

}