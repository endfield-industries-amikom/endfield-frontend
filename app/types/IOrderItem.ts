import type { Item } from "./IItem";

export interface OrderItem {
  id: string;
  orderType: string;
  orderId: string;
  itemId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: string;
  item?: Item;
}

export interface CreateOrderItemInput {
  itemId: string;
  quantity: number;
  unitPrice: number;
}
