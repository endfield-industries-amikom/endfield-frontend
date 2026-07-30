import { Await } from "react-router";
import { Suspense } from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import ProductDescription from "~/components/products/ProductDescription";
import type { Route } from "./+types/productId";
import ProductGallery from "~/components/products/ProductGallery";
import ProductInfo from "~/components/products/ProductInfo";
import ProductDetailSkeleton from "~/components/ProductDetailSkeleton";

import type { IProduct } from "~/interfaces/IProduct";
import { get } from "~/services/api.server";

interface ProductLoaderData {
  id: string;
  item: IProduct;
  type: "product" | "material";
}

export async function loader({ params }: Route.LoaderArgs) {
  const productPromise = get<{ data: ProductLoaderData }>(`/product/${params.id}`)
    .then((r) => r.data.item)
    .catch(() => null);
  return { product: productPromise };
}

export const meta: Route.MetaFunction = () => {
  return [{ title: "Product | Endfield" }];
};

export default function ProductId({ loaderData }: Route.ComponentProps) {
  const productPromise = loaderData.product;

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <Await resolve={productPromise}>
        {(product: IProduct | null) => {
          if (!product) {
            return (
              <Box
                sx={{
                  display: "flex",
                  minHeight: "60vh",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Paper
                  sx={{
                    px: 4,
                    py: 3,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "error.light",
                    bgcolor: "error.light",
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700 }} color="error.main">
                    Product not found
                  </Typography>
                </Paper>
              </Box>
            );
          }

          return (
            <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 6 }}>
              <Container maxWidth="lg">
                <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 2 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gap: 5,
                      gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                    }}
                  >
                    <Box sx={{ borderRadius: 3, bgcolor: "grey.100", p: 3 }}>
                      <ProductGallery product={product} />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <ProductInfo product={product} />
                    </Box>
                  </Box>
                </Paper>

                <Paper sx={{ mt: 6, p: 4, borderRadius: 4, boxShadow: 2 }}>
                  <ProductDescription product={product} />
                </Paper>
              </Container>
            </Box>
          );
        }}
      </Await>
    </Suspense>
  );
}
