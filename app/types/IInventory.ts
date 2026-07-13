import type { Item } from "./IItem";

export interface Inventory {
  id: string;
  warehouseId: string;
  itemId: string;
  quantityOnHand: number;
  reservedQuantity: number;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
  warehouse?: { id: string; name: string; code: string };
  item?: Item;
}
