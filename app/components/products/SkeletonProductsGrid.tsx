import { Box } from "@mui/material";
import SkeletonProductCard from "./SkeletonProductCard";

/** Matches the grid layout of ProductsGrid for seamless swap. */
export default function SkeletonProductsGrid() {
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
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </Box>
  );
}
