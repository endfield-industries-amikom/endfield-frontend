import type { OrderBase } from "./IOrder";
import type { Customer } from "./ICustomer";

export interface SalesOrder {
  orderId: string;
  customerId: string;
  customer?: Customer;
  order: OrderBase;
}
