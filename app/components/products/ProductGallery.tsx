import { Box } from "@mui/material";
import type { Item } from "~/types";
import { normalizeImageUrl } from "~/utils/image";

interface Props {
  product: Item;
}

export default function ProductGallery({ product }: Props) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        p: 2.5,
        boxShadow: 1,
      }}
    >
      <Box
        component="img"
        src={normalizeImageUrl(product.imageUri) || "https://placehold.co/600x600?text=No+Image"}
        alt={product.name}
        sx={{
          width: "100%",
          height: { xs: 320, md: 500 },
          borderRadius: 2,
          objectFit: "cover",
        }}
      />
    </Box>
  );
}
