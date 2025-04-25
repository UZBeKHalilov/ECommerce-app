import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: string;
  orderDate: string;
  total: number;
  items: OrderItem[];
}

@Injectable({providedIn: 'root'})
export class OrderService {
  private apiUrl = '/api/orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  createOrder(): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, {});
  }
}