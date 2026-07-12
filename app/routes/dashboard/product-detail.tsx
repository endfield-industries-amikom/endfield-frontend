import { Link } from "react-router";
import type { Route } from "./+types/product-detail";
import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import type { Product } from "~/types";
import { Box, Paper, Typography, Button, Divider, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: Product }>(`/product/${params.id}`, token, cookie);
  return { product: response.data };
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
  const product = loaderData?.product;
  if (!product) return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Product not found.</Typography></Paper>;

  const item = product.item;

  return (
    <Box>
      <Button component={Link} to="/dashboard/products" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Products</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Product Detail</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            {item?.imageUri ? (
              <Box component="img" src={item.imageUri} alt={item.name}
                sx={{ width: "100%", borderRadius: 2, objectFit: "cover", maxHeight: 300 }} />
            ) : (
              <Box sx={{ width: "100%", height: 250, bgcolor: "grey.200", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography color="text.secondary">No Image</Typography>
              </Box>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>{item?.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace", mt: 0.5 }}>SKU: {item?.sku}</Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid size={4}><Typography variant="caption" color="text.secondary">Category</Typography><Typography>{item?.category || "—"}</Typography></Grid>
              <Grid size={4}><Typography variant="caption" color="text.secondary">Type</Typography><Typography>{product.type || "product"}</Typography></Grid>
              <Grid size={4}><Typography variant="caption" color="text.secondary">Capacity Usage</Typography><Typography>{product.capacityUsage ?? "—"}</Typography></Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={6}><Typography variant="caption" color="text.secondary">Unit Price</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{(Number(item?.unitPrice) || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}</Typography></Grid>
              <Grid size={6}><Typography variant="caption" color="text.secondary">Sold Qty</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{item?.soldQty}</Typography></Grid>
            </Grid>
            {item?.description && <><Divider sx={{ my: 2 }} /><Typography variant="caption" color="text.secondary">Description</Typography><Typography>{item.description}</Typography></>}
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid size={6}><Typography variant="caption" color="text.secondary">Created</Typography><Typography variant="body2">{item ? new Date(item.createdAt).toLocaleString() : "—"}</Typography></Grid>
              <Grid size={6}><Typography variant="caption" color="text.secondary">Updated</Typography><Typography variant="body2">{item ? new Date(item.updatedAt).toLocaleString() : "—"}</Typography></Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
