import type { OrderBase } from "./IOrder";

export interface Shipment {
  id: string;
  orderType: string;
  orderId: string;
  carrier?: string;
  trackingNumber?: string;
  shippedDate?: string;
  deliveryDate?: string;
  status: string;
  statusMessage?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  order?: OrderBase;
}
