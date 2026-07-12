import type { OrderItem } from "./IOrderItem";

export interface OrderBase {
  id: string;
  warehouseId: string;
  warehouse?: { id: string; name: string; code: string };
  orderDate: string;
  status: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
}
