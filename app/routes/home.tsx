import { NavLink } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { products } from "~/data/Products";

import "tailwindcss";
import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "~/components/Product-Card";

const images = [
  "https://i0.wp.com/news.qoo-app.com/en/wp-content/uploads/sites/3/2022/03/03_HD.554121.jpg?resize=900%2C506&ssl=1",
  "https://pbs.twimg.com/media/GmIh4WvbcAQeRiM.jpg",
  "https://s1.zerochan.net/Arknights%3A.Endfield.600.4273863.jpg",
  "https://images.wallpapersden.com/image/download/arknights-endfield-gaming_bWdpZ22UmZqaraWkpJRmbmdlrWZlbWU.jpg",
  "https://images8.alphacoders.com/140/thumb-1920-1405303.jpg",
];

export default function Home() {
  return (
    <div className="scroll-smooth overflow-x-hidden">
      <section className="bg-linear-to-b from-[#F8F546] via-[#F8F546] to-white w-full h-[80vh] flex justify-center flex-col items-center cursor-default">
        <div className="helvetica font-extrabold text-[10vw] transition flicker-appearY">
          //ENDFIELD
        </div>
        <div className="absolute text-stripe-effect text-effect font-black text-[13vh] left-60 top-80 flicker-appearY">
          <h2>//ENDFIELD</h2>
        </div>
      </section>

      {/* What We Do */}
      <div className="z-10 bg-[#F8F546] gap-[13vw] flex grid-cols-2 p-[0vh_0vh_5vh_0vw]">
        <div className="bg-white p-[3vw] text-left text-[5vw] mb-[7vw] gap-[4vh] flex flex-col">
          <div>
            <h2 className="text-[3vw] sm:text-[2.5vw] md:text-[3vw] lg:text-[3vw] font-bold mb-[1vh] text-[#202020]">
              What We Do
            </h2>
            <p className="text-[3vw] md:text-[1.5vw] lg:text-[1vw] text-[#202020]">
              We are a leading company in the industry, providing top-notch
              solutions and services to our clients.
            </p>
            <NavLink to="/about">
              <button className="px-[6vw] py-[1.5vh]  bg-[#202020] text-white text-[3vw] md:text-[1.5vw] lg:text-[1vw] rounded-xl hover:bg-[#F8F546] hover:text-[#202020] hover:font-bold cursor-pointer transition">
                Learn More
              </button>
            </NavLink>
          </div>

          <div className="gap-[3vw] flex flex-col">
            <div className="border-2 p-[2vw] border-[#D9D9D9] flex justify-evenly items-top gap-[2vw]">
              <div className="bg-[#D9D9D9] w-[10vw] aspect-square"></div>
              <div>
                <h3 className="text-[2vw] md:text-[1.5vw] lg:text-[1vw] font-bold text-[#202020]">
                  Our Services
                </h3>
                <p className="text-[2vw] md:text-[1.5vw] lg:text-[1vw] text-[#202020]">
                  Our services include cutting-edge technology solutions
                  tailored for you.
                </p>
              </div>
            </div>
            <div className="border-2 p-[2vw] border-[#D9D9D9] flex justify-evenly items-top gap-[2vw]">
              <div className="bg-[#D9D9D9] w-[10vw] aspect-square"></div>
              <div>
                <h3 className="text-[2vw] md:text-[1.5vw] lg:text-[1vw] font-bold text-[#202020]">
                  Why Choose Us?
                </h3>
                <p className="text-[2vw] md:text-[1.5vw] lg:text-[1vw] text-[#202020]">
                  We combine experience, professionalism, and reliability.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-auto p-[3vh_0vw_0vw_0vw] gap-0 mb-[5vh] flex flex-col bg-white">
          <div className="translate-x-[-7vw]">
            <img
              src="https://static0.thegamerimages.com/wordpress/wp-content/uploads/wm/2026/01/arknights-endfield-placing-the-pac-structure.jpg?w=1600&h=900&fit=crop"
              alt=""
              className="rounded-xl w-full flicker-appearX"
            />
          </div>
          <div className="translate-x-[-7vw] translate-y-[3vh]">
            <img
              src="https://blog-uploads.eneba.games/uploads/2026/01/ARKNIGHT-HUB-768x430.jpg"
              alt=""
              className="rounded-xl w-full transform flicker-appearX"
              style={{
                animationDelay: ".19s",
              }}
            />
          </div>
        </div>
      </div>

      <div className="gap-0 flex flex-col items-center">
        <div className="text-center p-[0.5vw]">
          <h1 className="text-[5vw] md:text-[3vw] lg:text-[2vw] font-bold text-[#202020] tracking-wider">
            New Information
          </h1>
        </div>
        <div className="w-full">
          <div className="w-full mt-[3vh]">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              loop={true}
              centeredSlides={true}
              slidesPerView={3}
              spaceBetween={20}
              slidesPerGroup={1}
              speed={600}
              watchOverflow={false}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 3 },
              }}
            >
              {images.map((img, index) => (
                <SwiperSlide key={index}>
                  {({ isActive }) => (
                    <div
                      className={`
                    transition-all duration-500 overflow-hidden rounded-3xl
                    ${isActive ? "scale-100 opacity-100" : "scale-90 opacity-50"}
                  `}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-[30vh] md:h-[35vh] w-full object-cover"
                      />
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="pt-[3vw]">
          <button className="px-[8vw] py-[1.5vh] bg-[#202020] text-white text-[3vw] md:text-[1.5vw] lg:text-[1vw] rounded-xl hover:bg-[#F8F546] hover:text-[#202020] hover:font-bold transition cursor-pointer">
            More Information
          </button>
        </div>
      </div>

      {/* Sekat */}
      <div className="relative bg-[#F0F000] mt-[5vh] w-full h-[8vh] md:h-[10vh] overflow-visible">
        <img
          src="/baut-idk.png"
          alt="Baut"
          className="absolute left-2 md:left-6 top-8 sm:top-10 translate-y-[60%] h-[160%] w-auto object-contain z-10 sm:h-[120%] md:h-[140%] lg:h-[150%] xl:h-[160%] xl:top-8.5 lg:top-9"
        />
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
          {products.map((product, index) => (
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
