export interface Item {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category?: string;
  unitPrice: number;
  capacityUsage: number;
  isSellable: boolean;
  isPurchaseable: boolean;
  isManufactureable: boolean;
  imageUri?: string;
  soldQty: number;
  createdAt: string;
  updatedAt: string;
}
