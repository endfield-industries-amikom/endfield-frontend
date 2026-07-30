import { Await } from "react-router";
import { Suspense } from "react";
import type { Route } from "./+types/products";
import { Box, Container, Stack, Typography } from "@mui/material";
import ProductsGrid from "~/components/products/ProductsGrid";
import ProductsHero from "~/components/products/ProductsHero";
import ProductsSectionHeader from "~/components/products/ProductsSectionHeader";
import SkeletonProductsGrid from "~/components/products/SkeletonProductsGrid";

import type { IProduct } from "~/interfaces/IProduct";

/* ===================== API ===================== */
// import { get } from "~/services/api.server";
// import { normalizeImageUrl } from "~/utils/image";

/* ===================== DUMMY ===================== */
import { products } from "~/data/Products";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Products" },
    { name: "description", content: "Endfield Industries products" },
  ];
};

/* ===================== API ===================== */

// interface TopSellingItem {
//   id: string;
//   name: string;
//   sku: string;
//   unitPrice: number;
//   imageUri?: string;
//   description?: string;
//   category?: string;
// }

// export async function loader() {
//   const productsPromise = get<{ data: TopSellingItem[] }>("/product/top-selling")
//     .then((response) =>
//       (response.data || []).map(
//         (p): IProduct => ({
//           id: p.id,
//           name: p.name,
//           sku: p.sku,
//           description: p.description,
//           category: p.category,
//           unitPrice: Number(p.unitPrice || 0),
//           imageUri: normalizeImageUrl(p.imageUri),
//           isBest: false,
//         }),
//       ),
//     )
//     .catch(() => [] as IProduct[]);

//   return { products: productsPromise };
// }

/* ===================== DUMMY ===================== */

export default function Products() {
  return (
    <Box sx={{ bgcolor: "#FAFAFA", minHeight: "100vh", pb: 10 }}>
      <Container maxWidth="lg">
        <ProductsHero />

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
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}