import type { Route } from "../../../+types/root";
import { Box, Container, Stack, Typography } from "@mui/material";
import ProductsGrid from "~/components/products/ProductsGrid";
import ProductsHero from "~/components/products/ProductsHero";
import ProductsSectionHeader from "~/components/products/ProductsSectionHeader";
import { get } from "~/services/api.server";
import type { Product } from "~/types";
import type { IProduct } from "~/interfaces/IProduct";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Products" },
    { name: "description", content: "Endfield Industries products" },
  ];
};

export async function loader() {
  try {
    const response = await get<{ data: { data: Product[] } }>(
      "/product?page=1&limit=50",
    );
    const products: IProduct[] = (response.data.data || []).map((p) => ({
      id: p.id,
      name: p.item?.name || "",
      sku: p.item?.sku || "",
      description: p.item?.description,
      category: p.item?.category,
      unitPrice: Number(p.item?.unitPrice || 0),
      imageUri: p.item?.imageUri,
      isBest: false,
    }));
    return { products };
  } catch {
    return { products: [] as IProduct[] };
  }
}

export default function Products({ loaderData }: any) {
  const products = loaderData?.products ?? [];

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
