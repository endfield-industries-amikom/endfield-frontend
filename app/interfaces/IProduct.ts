export interface IProduct {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category?: string;
  unitPrice: number;
  imageUri?: string;
  isBest?: boolean;
}
