import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { products } from "~/data/Products";
import ProductCard from "~/components/data/Product-Card";
import ProductsSectionHeader from "~/components/products/ProductsSectionHeader";
import ProductsGrid from "~/components/products/ProductsGrid";

const images = [
  "https://i0.wp.com/news.qoo-app.com/en/wp-content/uploads/sites/3/2022/03/03_HD.554121.jpg?resize=900%2C506&ssl=1",
  "https://pbs.twimg.com/media/GmIh4WvbcAQeRiM.jpg",
  "https://s1.zerochan.net/Arknights%3A.Endfield.600.4273863.jpg",
  "https://images.wallpapersden.com/image/download/arknights-endfield-gaming_bWdpZ22UmZqaraWkpJRmbmdlrWZlbWU.jpg",
  "https://images8.alphacoders.com/140/thumb-1920-1405303.jpg",
];

export default function HomeContent() {
  return (
    <Box className="scroll-smooth overflow-x-hidden">
      <section className="bg-linear-to-b from-[#F8F546] via-[#F8F546] to-white w-full md:h-[80vh] xs:h-[60vh] flex justify-center flex-col items-center cursor-default">
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            py: { xs: 6, md: 8 },
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
          }}
        >
          <div className="helvetica font-extrabold text-[10vw] transition flicker-appearY">
            //ENDFIELD
          </div>
          <div className="text-transparent absolute text-stripe-effect text-effect font-black xs:text-[10vh] md:text-[13vh] xs:right-20 md:right-30 xs:bottom-50 md:bottom-40 flicker-appearY">
            <h2>//ENDFIELD</h2>
          </div>
        </Container>
      </section>

      {/* What We Do */}
      <Box sx={{ bgcolor: "#F8F546", py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: { xs: 4, lg: 8 },
              alignItems: "start",
            }}
          >
            <Box
              sx={{
                bgcolor: "white",
                p: { xs: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                gap: { xs: 3, md: 4 },
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#202020",
                    mb: 1,
                    fontSize: { xs: "1.6rem", md: "2rem" },
                  }}
                >
                  What We Do
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#202020",
                    mb: 2.5,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                  }}
                >
                  We are a leading company in the industry, providing top-notch
                  solutions and services to our clients.
                </Typography>
                <NavLink to="/about">
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#202020",
                      textTransform: "none",
                      borderRadius: 2,
                      px: { xs: 3, md: 4 },
                      "&:hover": {
                        bgcolor: "#F8F546",
                        color: "#202020",
                        fontWeight: 700,
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </NavLink>
              </Box>

              <Stack spacing={{ xs: 2, md: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderColor: "#D9D9D9",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "start" }}
                  >
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        bgcolor: "#D9D9D9",
                        borderRadius: 1,
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#202020",
                          fontSize: { xs: "1rem", md: "1.05rem" },
                        }}
                      >
                        Our Services
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#202020", mt: 0.5 }}
                      >
                        Our services include cutting-edge technology solutions
                        tailored for you.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderColor: "#D9D9D9",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "start" }}
                  >
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        bgcolor: "#D9D9D9",
                        borderRadius: 1,
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "#202020",
                          fontSize: { xs: "1rem", md: "1.05rem" },
                        }}
                      >
                        Why Choose Us?
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#202020", mt: 0.5 }}
                      >
                        We combine experience, professionalism, and reliability.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Box>

            <Stack
              spacing={{ xs: 2, md: 3 }}
              sx={{
                bgcolor: "white",
                p: { xs: 2, md: 3 },
              }}
            >
              <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
                <img
                  src="https://static0.thegamerimages.com/wordpress/wp-content/uploads/wm/2026/01/arknights-endfield-placing-the-pac-structure.jpg?w=1600&h=900&fit=crop"
                  alt=""
                  className="rounded-xl w-full flicker-appearX"
                />
              </Box>
              <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
                <img
                  src="https://blog-uploads.eneba.games/uploads/2026/01/ARKNIGHT-HUB-768x430.jpg"
                  alt=""
                  className="rounded-xl w-full transform flicker-appearX"
                  style={{
                    animationDelay: ".19s",
                  }}
                />
              </Box>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#202020",
              letterSpacing: 1,
              fontSize: { xs: "1.6rem", md: "2rem" },
            }}
          >
            New Information
          </Typography>
          <Box sx={{ mt: { xs: 3, md: 4 } }}>
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
          </Box>

          <Box sx={{ mt: { xs: 3, md: 4 } }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#202020",
                textTransform: "none",
                borderRadius: 2,
                px: { xs: 4, md: 6 },
                "&:hover": {
                  bgcolor: "#F8F546",
                  color: "#202020",
                  fontWeight: 700,
                },
              }}
            >
              More Information
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Sekat */}
      {/* Add to experimental for image
        <div className="relative bg-[#F0F000] mt-[5vh] w-full h-[8vh] md:h-[10vh] overflow-visible">
          <img
            src="/baut-idk.png"
            alt="Baut"
            className="absolute left-2 md:left-6 top-8 sm:top-10 translate-y-[60%] h-[160%] w-auto object-contain z-10 sm:h-[120%] md:h-[140%] lg:h-[150%] xl:h-[160%] xl:top-8.5 lg:top-9"
          />
        </div>
      */}
      <div className="relative bg-[#F0F000] mt-[5vh] w-full h-[8vh] md:h-[10vh] overflow-visible"></div>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 }, mb: 6 }}>
        <Stack spacing={3} sx={{ pb: 6 }}>
          <ProductsSectionHeader
            title="Our Product"
            subtitle="Discover our range of innovative products."
          />
          <ProductsGrid products={products} />
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
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
        </Box>
      </Container>
    </Box>
  );
}
