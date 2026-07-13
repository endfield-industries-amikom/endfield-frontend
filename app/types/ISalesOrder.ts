import type { OrderBase } from "./IOrder";
import type { Customer } from "./ICustomer";
import type { Region } from "./IRegion";

export interface SalesOrder {
  orderId: string;
  customerId: string;
  regionId: string;
  region?: Region;
  customer?: Customer;
  order: OrderBase;
}
