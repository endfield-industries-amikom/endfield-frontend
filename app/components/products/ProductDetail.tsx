import { useParams } from "react-router";
import { products } from "~/data/Products";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";

export default function ProductDetail() {
  const { id } = useParams();

  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 px-8 py-6 shadow">
          <h2 className="text-2xl font-bold text-red-600">
            Product tidak ditemukan
          </h2>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Product Section */}
        <div className="grid gap-10 rounded-3xl bg-white p-8 shadow-lg lg:grid-cols-2">

          {/* Gallery */}
          <div className="rounded-2xl bg-gray-100 p-6">
            <ProductGallery product={product} />
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            <ProductInfo product={product} />
          </div>

        </div>

        {/* Description */}
        <div className="mt-12 rounded-3xl bg-white p-8 shadow-lg">
          <ProductDescription product={product} />
        </div>

      </div>
    </section>
  );
}