import type { IProduct } from "~/interfaces/IProduct";

export const products: IProduct[] = [
  {
    id: "1",
    name: "Product 1",
    sku: "SKU001",
    description: "Musang Plenger",
    unitPrice: 99.99,
    isBest: true,
  },
  {
    id: "2",
    name: "Product 2",
    sku: "SKU002",
    description: "",
    unitPrice: 21,
    isBest: false,
  },
  {
    id: "3",
    name: "Product 3",
    sku: "SKU003",
    description: "",
    unitPrice: 15,
    isBest: false,
  },
  {
    id: "4",
    name: "Product 4",
    sku: "SKU004",
    description: "",
    unitPrice: 10,
    isBest: false,
  },
  {
    id: "5",
    name: "Product 5",
    sku: "SKU005",
    description: "",
    unitPrice: 50,
    isBest: false,
  },
];
