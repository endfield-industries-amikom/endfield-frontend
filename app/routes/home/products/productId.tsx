import type { Route } from "./+types/productId";
import ProductDetail from "~/components/products/ProductDetail";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Product Detail | Endfield" },
    {
      name: "description",
      content: "Endfield product detail",
    },
  ];
};

/*
====================================================
API PRODUCT DETAIL
====================================================

import { get } from "~/services/api.server";
import type { Product } from "~/types";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const response = await get<{ data: Product }>(
      `/product/${params.id}`
    );

    return {
      product: response.data,
    };
  } catch {
    return {
      product: null,
    };
  }
}

Meta API:

export const meta: Route.MetaFunction = ({ data }) => {
  const product = (data as any)?.product as Product | null;

  const title = product?.item
    ? `${product.item.name} | Endfield`
    : "Product | Endfield";

  return [
    { title },
    {
      name: "description",
      content: title,
    },
  ];
};

Data yang didapat dari API:

product.id
product.type

product.item.name
product.item.sku
product.item.category
product.item.unitPrice
product.item.description
product.item.imageUri

====================================================
*/

export default function ProductId() {
  return <ProductDetail />;
}