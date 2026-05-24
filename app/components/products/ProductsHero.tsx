import { Box, Typography } from "@mui/material";

export default function ProductsHero() {
  return (
    <Box
      sx={{
        py: { xs: 4, md: 6 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="background-image text-stripe-effect font-black">
        PRODUCTS
      </div>
    </Box>
  );
}
