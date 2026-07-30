import type { IProduct } from "~/interfaces/IProduct";

interface Props {
  product: IProduct;
}

export default function ProductDescription({ product }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-semibold">
        Deskripsi Produk
      </h2>

      <p className="text-justify leading-8 text-gray-600">
        {product.description || "Belum ada deskripsi."}
      </p>
    </div>
  );
}