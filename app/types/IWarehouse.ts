export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address?: string;
  regionId?: string;
  maxCapacity?: number;
  currentLoad?: number;
  region?: { id: string; name: string; code: string };
  createdAt: string;
  updatedAt: string;
}
