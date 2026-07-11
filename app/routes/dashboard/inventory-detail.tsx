import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { Link } from "react-router";
import type { Route } from "./+types/inventory-detail";
import { Box, Paper, Typography, Button, Divider, Grid, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface InventoryDetail { id: string; warehouseId: string; productId: string; quantityOnHand: number; reservedQuantity: number; reorderLevel: number; createdAt: string; updatedAt: string; product?: { id: string; name: string; sku: string }; warehouse?: { id: string; name: string; code: string }; }

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: InventoryDetail }>(`/inventory/${params.id}`, token, cookie);
  return { inventory: response.data };
}

export default function InventoryDetail({ loaderData }: Route.ComponentProps) {
  const inv = loaderData?.inventory;
  if (!inv) return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Inventory record not found.</Typography></Paper>;

  const available = inv.quantityOnHand - inv.reservedQuantity;
  const low = inv.quantityOnHand <= inv.reorderLevel;

  return (
    <Box>
      <Button component={Link} to="/dashboard/inventory" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Inventory</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Inventory Detail</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Record ID</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{inv.id}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Status</Typography><Chip label={low ? "Low Stock" : "OK"} size="small" color={low ? "error" : "success"} /></Grid></Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Product</Typography>
            {inv.product ? <Box><Button component={Link} to={`/dashboard/products/${inv.product.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{inv.product.name}</Button><Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace", display: "block" }}>{inv.product.sku}</Typography></Box> : <Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{inv.productId}</Typography>}
          </Grid>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Warehouse</Typography>
            {inv.warehouse ? <Box><Button component={Link} to={`/dashboard/warehouses/${inv.warehouse.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{inv.warehouse.name}</Button><Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace", display: "block" }}>{inv.warehouse.code}</Typography></Box> : <Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{inv.warehouseId}</Typography>}
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid size={4}><Typography variant="caption" color="text.secondary">Qty On Hand</Typography><Typography variant="h5" sx={{ fontWeight: 600 }}>{inv.quantityOnHand}</Typography></Grid>
          <Grid size={4}><Typography variant="caption" color="text.secondary">Reserved</Typography><Typography variant="h5" sx={{ fontWeight: 600 }}>{inv.reservedQuantity}</Typography></Grid>
          <Grid size={4}><Typography variant="caption" color="text.secondary">Available</Typography><Typography variant="h5" sx={{ fontWeight: 600 }} color={available < 0 ? "error" : "inherit"}>{available}</Typography></Grid>
        </Grid>
        <Box sx={{ mt: 1 }}><Typography variant="caption" color="text.secondary">Reorder Level</Typography><Typography variant="h5" sx={{ fontWeight: 600 }}>{inv.reorderLevel}</Typography></Box>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Created</Typography><Typography variant="body2">{new Date(inv.createdAt).toLocaleString()}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Updated</Typography><Typography variant="body2">{new Date(inv.updatedAt).toLocaleString()}</Typography></Grid></Grid>
      </Paper>
    </Box>
  );
}
