import type { OrderItem } from "./IOrderItem";

export interface OrderBase {
  id: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}
