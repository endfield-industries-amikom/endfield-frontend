export interface TopSellingItem {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
  imageUri?: string;
  description?: string;
  category?: string;
  isBest?: boolean;
}
