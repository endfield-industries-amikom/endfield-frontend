import type { Route } from "../../+types/root";
import { Box, Container, Stack } from "@mui/material";
import ProductsGrid from "~/components/products/ProductsGrid";
import ProductsHero from "~/components/products/ProductsHero";
import ProductsSectionHeader from "~/components/products/ProductsSectionHeader";
import { products as productsItems } from "~/data/Products";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Products" },
    { name: "description", content: "Endfield Industries products" },
  ];
};

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
          <ProductsGrid products={productsItems} />
        </Stack>
      </Container>
    </Box>
  );
}
