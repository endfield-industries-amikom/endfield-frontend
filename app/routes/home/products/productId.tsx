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
  const title = product?.item ? `${product.item.name} | Endfield` : "Product | Endfield";
  return [{ title }, { name: "description", content: title }];
};

export default function Product({ loaderData }: Route.ComponentProps) {
  const product = loaderData?.product;
  if (!product) return <Container maxWidth="md" sx={{ py: 8 }}><Typography variant="h4">Product not found</Typography></Container>;

  const item = product.item;

  return (
    <Box sx={{ bgcolor: "#FAFAFA", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 5 }}>
              {item?.imageUri ? (
                <Box component="img" src={item.imageUri} alt={item.name}
                  sx={{ width: "100%", borderRadius: 2, objectFit: "cover", maxHeight: 350 }} />
              ) : (
                <Box sx={{ width: "100%", height: 300, bgcolor: "grey.200", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography color="text.secondary">No Image</Typography>
                </Box>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{item?.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontFamily: "monospace" }}>SKU: {item?.sku}</Typography>
              {item?.category && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Category: {item.category}</Typography>}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }} color="primary">
                {(Number(item?.unitPrice) || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}
              </Typography>
              {item?.description && <><Divider sx={{ my: 2 }} /><Typography variant="body1" color="text.secondary">{item.description}</Typography></>}
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
