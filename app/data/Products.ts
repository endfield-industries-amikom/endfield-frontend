import type { IProduct } from "~/interfaces/IProduct";

export const products: IProduct[] = [
  {
    id: 1,
    title: "Product 1",
    description: "Musang Plenger",
    price: 99.99,
    isBest: true,
  },
  {
    id: 2,
    title: "Product 2",
    description: "",
    price: 21,
    isBest: false,
  },
  {
    id: 3,
    title: "Product 3",
    description: "",
    price: 15,
    isBest: false,
  },
  {
    id: 4,
    title: "Product 4",
    description: "",
    price: 10,
    isBest: false,
  },
  {
    id: 5,
    title: "Product 5",
    description: "",
    price: 50,
    isBest: false,
  },
];
