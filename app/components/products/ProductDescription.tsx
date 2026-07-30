import { Card, CardContent, Typography } from "@mui/material";
import type { IProduct } from "~/interfaces/IProduct";

interface Props {
  product: IProduct;
}

export default function ProductDescription({ product }: Props) {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Product Description
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: "justify", lineHeight: 2 }}>
          {product.description || "No description available."}
        </Typography>
      </CardContent>
    </Card>
  );
}
