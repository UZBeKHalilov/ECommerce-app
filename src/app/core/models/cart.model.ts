import { CartItem } from "./CartItem.model";

export interface Cart {
    id: number;
    userId: string;
    items: CartItem[];
}