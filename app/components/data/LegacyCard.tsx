import { NavLink } from "react-router";

export default function LegacyCard() {
  return (
    <div className="flex gap-[1.2vw] min-w-max px-[3vw] overflow-show">
      <NavLink
        to="/products"
        className="w-[12vw] border-[0.1vw] border-[#C2C2C2] bg-[#CFCFCF] h-[18vw] rounded flex flex-col gap-[0.5vw] justify-start overflow-hidden hover:scale-[1.1] transition delay-75 duration-300 ease-in-out border-spin"
      >
        <div className="flex justify-center items-center h-[3vw] w-[5vw] rounded-br-md  overflow-hidden bg-[#C2C2C2] text-center">
          <p className="text-[0.8vw] lg:text-[0.5vw] font-medium text-[#202020]">
            Best Seller
          </p>
        </div>
        <div className="flex justify-center items-center h-[20vw]">
          <h2 className="text-[1.2vw] md:text-[0.8vw] lg:text-[0.8vw]  text-[#202020]">
            Product 1
          </h2>
        </div>
        <div className="bg-white w-full h-[10vw] flex flex-col items-start justify-start gap-[0.5vw] p-[1vw]">
          <p className="text-[1.2vw] md:text-[1vw] lg:text-[0.8vw] text-[#202020]">
            Musang Plenger
          </p>
          <h3 className="text-[1.5vw] md:text-[1vw] lg:text-[1vw] font-bold text-[#202020]">
            $99.99
          </h3>
          <div className="flex justify-center items-center w-full">
            <p className="text-[1vw] md:text-[0.8vw] lg:text-[1vw] text-[#202020] hover:font-bold transition">
              ...
            </p>
          </div>
        </div>
      </NavLink>
    </div>
  );
}
