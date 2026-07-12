import type { Item } from "./IItem";

export interface Product {
  id: string;
  itemId: string;
  type: string;
  capacityUsage: number;
  item: Item;
}
