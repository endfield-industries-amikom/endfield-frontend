import type { IProduct } from "~/interfaces/IProduct";

interface Props {
  product: IProduct;
}

export default function ProductGallery({ product }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <img
        src={product.imageUri || "https://placehold.co/600x600?text=No+Image"}
        alt={product.name}
        className="h-80 w-full rounded-lg object-cover md:h-[500px]"
      />
    </div>
  );
}