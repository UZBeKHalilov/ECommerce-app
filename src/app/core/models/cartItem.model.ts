export interface CartItem {
  productId: number;
  quantity: number;
  product: {
    name: string;
    price: number;
  }
}