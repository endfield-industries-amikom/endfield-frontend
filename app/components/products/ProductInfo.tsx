import { useState } from "react";
import type { IProduct } from "~/interfaces/IProduct";

interface Props {
  product: IProduct;
}

export default function ProductInfo({ product }: Props) {
  const [quantity, setQuantity] = useState(1);

  const subtotal = quantity * product.unitPrice;

  const formatPrice = (price: number) =>
    price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  return (
    <div className="flex flex-col">

      {/* Category Badge */}
      {product.category && (
        <div className="mb-5">
          <span
            className="
              inline-flex
              rounded-full
              bg-green-100
              px-4
              py-1.5
              text-sm
              font-semibold
              text-green-700
            "
          >
            {product.category}
          </span>
        </div>
      )}


      {/* Product Name */}
      <h1
        className="
          text-4xl
          font-extrabold
          leading-tight
          text-gray-900
          lg:text-5xl
        "
      >
        {product.name}
      </h1>


      {/* SKU */}
      <div className="mt-5 flex items-center gap-3 text-sm text-gray-500">

        <span>
          SKU
        </span>

        <span className="font-semibold text-gray-700">
          {product.sku}
        </span>

      </div>


      {/* Price */}
      <div className="mt-8">

        <p className="text-sm font-medium text-gray-500">
          Price
        </p>

        <h2
          className="
            mt-2
            text-5xl
            font-black
            text-green-600
          "
        >
          {formatPrice(product.unitPrice)}
        </h2>

      </div>


      {/* Divider */}
      <div className="my-8 h-px bg-gray-200" />


      {/* Quantity */}
      <div>

        <p className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-700">
          Quantity
        </p>


        <div
          className="
            flex
            w-fit
            items-center
            overflow-hidden
            rounded-xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >

          <button
            onClick={() =>
              quantity > 1 && setQuantity(quantity - 1)
            }
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              text-2xl
              font-bold
              text-gray-700
              transition
              hover:bg-gray-100
            "
          >
            −
          </button>


          <span
            className="
              flex
              h-12
              w-14
              items-center
              justify-center
              border-x
              text-lg
              font-bold
            "
          >
            {quantity}
          </span>


          <button
            onClick={() => setQuantity(quantity + 1)}
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              text-2xl
              font-bold
              text-gray-700
              transition
              hover:bg-gray-100
            "
          >
            +
          </button>

        </div>

      </div>


      {/* Subtotal */}
      <div
        className="
          mt-8
          rounded-2xl
          bg-gradient-to-r
          from-green-50
          to-emerald-50
          p-6
          ring-1
          ring-green-100
        "
      >

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Total Price
            </p>

            <p className="mt-1 text-3xl font-extrabold text-green-700">
              {formatPrice(subtotal)}
            </p>
          </div>


          <div
            className="
              rounded-xl
              bg-white
              px-4
              py-2
              text-sm
              font-semibold
              text-green-600
              shadow-sm
            "
          >
            {quantity} Item
          </div>

        </div>

      </div>


      {/* Action Button */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">

        <button
          className="
            rounded-xl
            border-2
            border-green-600
            py-4
            font-bold
            text-green-600
            transition
            duration-300
            hover:bg-green-600
            hover:text-white
          "
        >
          Add to Cart
        </button>


        <button
          className="
            rounded-xl
            bg-green-600
            py-4
            font-bold
            text-white
            shadow-lg
            shadow-green-200
            transition
            duration-300
            hover:-translate-y-1
            hover:bg-green-700
          "
        >
          Buy Now
        </button>

      </div>


      {/* Additional Info */}
      <div
        className="
          mt-8
          rounded-xl
          border
          border-gray-100
          bg-gray-50
          p-5
        "
      >

        <div className="flex justify-between text-sm">

          <span className="text-gray-500">
            Availability
          </span>

          <span className="font-semibold text-green-600">
            In Stock
          </span>

        </div>


        <div className="mt-3 flex justify-between text-sm">

          <span className="text-gray-500">
            Shipping
          </span>

          <span className="font-semibold text-gray-700">
            Ready to ship
          </span>

        </div>

      </div>


    </div>
  );
}