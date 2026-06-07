import type { Route } from "./+types/product:id";
import { products } from "~/data/Products";

function getProductById(id: string) {
  const parsedId = Number.parseInt(id, 10);
  if (Number.isNaN(parsedId)) return undefined;

  return products.find((product) => product.id === parsedId);
}

export const meta: Route.MetaFunction = ({ params }) => {
  const product = getProductById(params.id);
  const title = product ? `${product.title} | Endfield` : "Product | Endfield";

  return [
    { title },
    { name: "description", content: title },
    { property: "og:title", content: title },
    { property: "og:description", content: title },
  ];
};

export default function Product({ params }: Route.ComponentProps) {
  const product = getProductById(params.id);

  if (!product) {
    return (
      <div>
        <h1>Product not found</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Product {product.id}</h1>
      <p>Viewing product {product.title}</p>
    </div>
  );
}
