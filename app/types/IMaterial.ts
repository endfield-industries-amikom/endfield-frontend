import type { Item } from "./IItem";

export interface Material {
  id: string;
  itemId: string;
  unit?: string;
  item: Item;
}
