import type { Route } from "./+types/productId";
import { get } from "~/services/api.server";
import type { Product } from "~/services/types";
import { Box, Paper, Typography, Grid, Divider, Container } from "@mui/material";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const response = await get<{ data: Product }>(`/product/${params.id}`);
    return { product: response.data };
  } catch {
    return { product: null };
  }
}

export const meta: Route.MetaFunction = ({ data }) => {
  const product = (data as any)?.product as Product | null;
  const title = product ? `${product.name} | Endfield` : "Product | Endfield";
  return [
    { title },
    { name: "description", content: title },
  ];
};

export default function Product({ loaderData }: Route.ComponentProps) {
  const product = loaderData?.product;

  const imageUrl = product?.imageUri?.startsWith("/api/")
    ? `${process.env.API_GATEWAY_URL || ""}${product.imageUri}`
    : product?.imageUri;

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4">Product not found</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#FAFAFA", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              {imageUrl ? (
                              <Box component="img" src={imageUrl} alt={product.name}
                  sx={{ width: "100%", borderRadius: 2, objectFit: "cover", maxHeight: 350 }} />
              ) : (
                <Box sx={{
                  width: "100%", height: 300, bgcolor: "grey.200",
                  borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Typography color="text.secondary">No Image</Typography>
                </Box>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{product.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace", mt: 1 }}>
                SKU: {product.sku}
              </Typography>
              {product.category && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Category: {product.category}
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }} color="primary">
                {product.unitPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}
              </Typography>
              {product.description && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    {product.description}
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
