import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { NavLink } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import ProductsSectionHeader from "~/components/products/ProductsSectionHeader";
import ProductsGrid from "~/components/products/ProductsGrid";
import { get } from "~/services/api.server";
import type { Route } from "./+types/home-content";
import type { IProduct } from "~/interfaces/IProduct";
import { normalizeImageUrl } from "~/utils/image";

/* ------------------------------------------------------------------ */
/*  Loader – fetch top 10 products from API                            */
/* ------------------------------------------------------------------ */

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const response = await get<{ data: { id: string; name: string; sku: string; unitPrice: number; imageUri?: string; description?: string; category?: string }[] }>(
          "/product/top-selling",
        );
        const products: IProduct[] = (response.data || []).map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          description: p.description,
          category: p.category,
          unitPrice: Number(p.unitPrice || 0),
          imageUri: normalizeImageUrl(p.imageUri),
      isBest: false,
    }));
    return { products };
  } catch {
    return { products: [] as IProduct[] };
  }
}

const images = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&h=506&fit=crop",
  "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=900&h=506&fit=crop",
  "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=900&h=506&fit=crop",
  "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=900&h=506&fit=crop",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=900&h=506&fit=crop",
];

export default function HomeContent({ loaderData }: Route.ComponentProps) {
  const products = loaderData?.products ?? [];

  return (
    <Box className="scroll-smooth overflow-x-hidden">
      <div className="relative bg-[url('/HeroSection.png')] bg-cover bg-center flex items-center justify-center no-repeat lg:h-[100vh] xs:h-[50vh] md:h-[50vh]">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "0.5fr", lg: "1fr 1fr" },
            alignItems: { xs: "start", md: "flex-start" },
            justifyContent: "start",
            width: "100%",
            height: "100%"
          }}
        >
          <Box
          sx={{
            maxWidth: "lg",
            backgroundImage: "linear-gradient(90deg, #F8F546 50%, transparent 100%)",
            height: { xs: 200, md: 480, lg: "100%" },
            width: "100%",
        }}
        >
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            position: "relative",
            px: { xs: 2, md: 0 },
          }}>
            <Typography
              className="flicker-appearX"
              variant="h2"
              sx={{
                position: "relative",
                zIndex: 2,
                color: "#202020",
                letterSpacing: 1,
                fontSize: { xs: "3rem", md: "5rem", lg: "8rem" },
                lineHeight: 1,
                fontWeight: 700,
                textAlign: "center",
                fontFamily: 'Helvetica',
              }}
            >
              //ENDFIELD
            </Typography>
            <Typography
              className="text-effect text-stripe-effect flicker-appearX"
              variant="h2"
              sx={{
                position: "absolute",
                top: { xs: "50%", md: "50%" },
                left: "50%",
                transform: { xs: "translate(-55%, -100%)", md: "translate(-55%, -115%)", lg: "translate(-55%, -110%)" },
                width: "100%",
                textAlign: "center",
                color: "rgba(32, 32, 32, 0.08)",
                fontSize: { xs: "3.5rem", md: "5rem", lg: "9rem" },
                lineHeight: 1,
                fontWeight: 700,
                zIndex: 1,
                pointerEvents: "none",
                userSelect: "none",
                opacity: 0.7,
              }}
            >
            //ENDFIELD
            </Typography>

            <Typography
              className="flicker-appearX"
              variant="h6"
              sx={{
                position: "relative",
                zIndex: 2,
                color: "#202020",
                letterSpacing: 1,
                fontSize: { xs: "1rem", md: "0.65rem", lg: "1.2rem" },
                lineHeight: 1.4,
                fontWeight: 100,
                textAlign: "left",
                fontFamily: 'Helvetica',
                mt: { xs: 5, md: 5, lg: 10 },
                ml: { xs: 0, md: 5, lg: 10 },
                pr: { xs: 0, md: 5, lg: 10 },
              }}
            >
              Endfield Industry delivers reliable supply chain solutions that optimize sourcing, logistics, and distribution with efficiency and excellence.
            </Typography>
          </Box>


          </Box>
          <Box
          sx={{
            Width: "100%",
            Height: 200,
            maxWidth: "lg",
          }}
          >

          </Box>
        </Box>
      </div>

      <Box
        sx={{
          bgcolor: "white",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: 100,
        }}
        >

      </Box>

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
                                  <Button variant="outlined">
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
                        bgcolor: "#F0F000",
                        borderRadius: 1,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <GroupsIcon sx={{ fontSize: 40, color: "#202020" }} />
                    </Box>
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
                        bgcolor: "#F0F000",
                        borderRadius: 1,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <HandshakeIcon sx={{ fontSize: 40, color: "#202020" }} />
                    </Box>
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
            <Button variant="outlined">
                          More Information
                        </Button>
          </Box>
        </Container>
      </Box>

      {/* Sekat */}
      <div className="relative bg-[#F0F000] mt-[5vh] w-full h-[8vh] md:h-[10vh] overflow-visible"></div>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 }, mb: 6 }}>
        <Stack spacing={3} sx={{ pb: 6 }}>
          <ProductsSectionHeader
            title="Our Product"
            subtitle="Discover our range of innovative products."
          />
          {products.length > 0 ? (
            <ProductsGrid products={products} />
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No Product Yet
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                Our product catalog is being prepared. Check back soon!
              </Typography>
            </Box>
          )}
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <NavLink to="/products">
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#C2C2C2",
                          color: "#202020",
                          textTransform: "none",
                          borderRadius: 1,
                          boxShadow: 0,
                          "&:hover": {
                            borderColor: "#202020",
                            bgcolor: "transparent",
                          },
                        }}
                      >
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/2641/2641264.png "
                          alt="Arrow"
                          className="w-[1vw] h-[1vw] mr-[0.5vw]"
                        />
                        See More Products
                      </Button>
                    </NavLink>
        </Box>
      </Container>
    </Box>
  );
}
