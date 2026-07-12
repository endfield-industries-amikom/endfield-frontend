import type { Item } from "./IItem";

export interface ProductionSchematic {
  id: string;
  name: string;
  type: string;
  inputs: string[];
  inputQty: number[];
  duration: number;
  outputQty: number;
  outputItemId: string;
  outputItem?: Item;
  createdAt: string;
  updatedAt: string;
}
