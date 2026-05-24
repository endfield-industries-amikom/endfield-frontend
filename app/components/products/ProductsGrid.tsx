import { Box } from "@mui/material";
import type { IProduct } from "~/interfaces/IProduct";
import ProductCard from "~/components/data/Product-Card";

interface ProductsGridProps {
  products: IProduct[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: { xs: 2, sm: 3 },
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} layout="grid" {...product} />
      ))}
    </Box>
  );
}
