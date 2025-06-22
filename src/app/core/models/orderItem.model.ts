import { Product } from './product.model';


export interface OrderItem {
    productId: number;
    product?: Product;
    quantity: number;
    price?: number;
  }