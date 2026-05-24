import ProductCard from "~/components/data/Product-Card";
import type { Route } from "../../+types/root";
import { NavLink } from "react-router";
import { products as productsItems } from "~/data/Products";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Products" },
    { name: "description", content: "Endfield Industries products" },
  ];
};

export default function products() {
  return (
    <div>
      <div className="background-image text-stripe-effect font-black">
        PRODUCTS
      </div>

      <div className="mb-[20vh]">
        <div className="p-[4vw] flex flex-col items-start">
          <h3 className="text-[5vw] md:text-[2.5vw] lg:text-[1vw] font-bold text-[#202020]">
            Our Product
          </h3>
          <p className="text-[1.5vw] md:text-[1.50vw] lg:text-[1vw] text-[#202020]">
            Discover our range of innovative products.
          </p>
        </div>
        <div className="w-full overflow-x-scroll h-fit flex items-center gap-4 ml-[3vw]">
          {productsItems.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
        <div className="flex justify-center items-center w-full pt-[3vw]">
          <NavLink to="/products">
            <button className="border-[0.1vw] px-[2vw] py-[0.5vh] border-[#C2C2C2] text-[#202020] text-[3vw] md:text-[1vw] lg:text-[1vw] rounded hover:font-bold transition cursor-pointer flex flex-row items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2641/2641264.png "
                alt="Arrow"
                className="w-[1vw] h-[1vw] mr-[0.5vw]"
              />
              See More Products
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
