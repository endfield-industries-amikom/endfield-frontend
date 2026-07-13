import type { OrderBase } from "./IOrder";
import type { Supplier } from "./ISupplier";
import type { Warehouse } from "./IWarehouse";

export interface PurchaseOrder {
  orderId: string;
  supplierId: string;
  warehouseId: string;
  warehouse?: Warehouse;
  supplier?: Supplier;
  order: OrderBase;
}
