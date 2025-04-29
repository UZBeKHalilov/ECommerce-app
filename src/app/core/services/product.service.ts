import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';


@Injectable({providedIn: 'root'})
export class ProductService {
  private apiUrl = '/api/v1/products';
  private apiUrlv2 = '/api/v2/products';
  
  constructor(private http: HttpClient) {}

  getAll(categoryId?: number): Observable<Product[]> {
    let params = new HttpParams();
    if(categoryId) {
      params = params.set('categoryId', categoryId.toString());
    }
    return this.http.get<Product[]>(this.apiUrl, { params });
  }

  getAllByCategoryId(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrlv2}/${categoryId}`);
  }

  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
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
}