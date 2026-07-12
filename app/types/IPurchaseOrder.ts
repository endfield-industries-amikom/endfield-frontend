import type { OrderBase } from "./IOrder";
import type { Supplier } from "./ISupplier";

export interface PurchaseOrder {
  orderId: string;
  supplierId: string;
  supplier?: Supplier;
  order: OrderBase;
}
