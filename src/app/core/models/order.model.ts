import { OrderItem as OrderItems } from './orderItem.model';

export interface Order {
    id?: number;
    orderDate?: Date;
    total?: number;
    paymentStatus?: string;
    orderItems: OrderItems[];
  }