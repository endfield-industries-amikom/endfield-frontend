import { Link } from "react-router";
import type { Route } from "./+types/material-detail";
import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import type { Material } from "~/services/types";
import { Box, Paper, Typography, Button, Divider, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: Material }>(`/material/${params.id}`, token, cookie);
  return { material: response.data };
}

export default function MaterialDetail({ loaderData }: Route.ComponentProps) {
  const material = loaderData?.material;
  if (!material) return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Material not found.</Typography></Paper>;

  const item = material.item;

  return (
    <Box>
      <Button component={Link} to="/dashboard/materials" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Materials</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Material Detail</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Material ID</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{material.id}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">SKU</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{item?.sku}</Typography></Grid></Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{item?.name}</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Category</Typography><Typography>{item?.category || "—"}</Typography></Grid>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Unit</Typography><Typography>{material.unit || "—"}</Typography></Grid>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Unit Price</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{(Number(item?.unitPrice) || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}</Typography></Grid>
        </Grid>
        {item?.description && <><Divider sx={{ my: 2 }} /><Typography variant="caption" color="text.secondary">Description</Typography><Typography>{item.description}</Typography></>}
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Created</Typography><Typography variant="body2">{item ? new Date(item.createdAt).toLocaleString() : "—"}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Updated</Typography><Typography variant="body2">{item ? new Date(item.updatedAt).toLocaleString() : "—"}</Typography></Grid></Grid>
      </Paper>
    </Box>
  );
}
