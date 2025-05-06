import { OrderItem } from './orderItem.model';

export interface Order {
    id: number;
    userId: string;
    orderDate: string;
    total: number;
    status: string;
    items: OrderItem[];
  }