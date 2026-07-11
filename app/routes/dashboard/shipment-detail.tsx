import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { Link } from "react-router";
import type { Route } from "./+types/shipment-detail";
import type { Shipment } from "~/services/types";
import { Box, Paper, Typography, Button, Divider, Grid, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: Shipment }>(`/shipment/${params.id}`, token, cookie);
  return { shipment: response.data };
}

function statusColor(s: string) { const m: Record<string, "warning" | "info" | "success" | "error"> = { PENDING: "warning", IN_TRANSIT: "info", DELIVERED: "success", CANCELLED: "error" }; return m[s] || "default"; }

export default function ShipmentDetail({ loaderData }: Route.ComponentProps) {
  const shipment = loaderData?.shipment;
  if (!shipment) return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Shipment not found.</Typography></Paper>;

  const poId = shipment.purchaseOrder?.id ?? shipment.poId;
  const soId = shipment.salesOrder?.id ?? shipment.salesOrderId;

  return (
    <Box>
      <Button component={Link} to="/dashboard/shipments" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Shipments</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Shipment Detail</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Shipment ID</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{shipment.id}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Status</Typography><Chip label={shipment.status} size="small" color={statusColor(shipment.status)} /></Grid></Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Carrier</Typography><Typography>{shipment.carrier || "—"}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Tracking Number</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{shipment.trackingNumber || "—"}</Typography></Grid></Grid>
        <Box sx={{ mt: 2 }}><Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Shipped Date</Typography><Typography>{shipment.shippedDate ? new Date(shipment.shippedDate).toLocaleDateString() : "—"}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Delivery Date</Typography><Typography>{shipment.deliveryDate ? new Date(shipment.deliveryDate).toLocaleDateString() : "—"}</Typography></Grid></Grid></Box>
        {shipment.notes && <><Divider sx={{ my: 2 }} /><Typography variant="caption" color="text.secondary">Notes</Typography><Typography>{shipment.notes}</Typography></>}
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Linked Purchase Order</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{poId}</Typography>{shipment.purchaseOrder && <Typography variant="caption" color="text.secondary">Status: {shipment.purchaseOrder.status} · Total: {shipment.purchaseOrder.totalAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</Typography>}</Grid>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Linked Sales Order</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{soId || "—"}</Typography>{shipment.salesOrder && <Typography variant="caption" color="text.secondary">Status: {shipment.salesOrder.status} · Total: {shipment.salesOrder.totalAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</Typography>}</Grid>
        </Grid>
        <Divider sx={{ my: 2 }} /><Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Created</Typography><Typography variant="body2">{new Date(shipment.createdAt).toLocaleString()}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Updated</Typography><Typography variant="body2">{new Date(shipment.updatedAt).toLocaleString()}</Typography></Grid></Grid>
      </Paper>
    </Box>
  );
}
