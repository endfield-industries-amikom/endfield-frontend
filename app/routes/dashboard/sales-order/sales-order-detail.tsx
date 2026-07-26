import { Link } from "react-router";
import type { Route } from "../+types/sales-order-detail";
import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import type { SalesOrder, OrderItem } from "~/types";
import { Box, Paper, Typography, Button, Divider, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: SalesOrder }>(`/sales-order/${params.id}`, token, cookie);
  return { salesOrder: response.data };
}

function statusColor(s: string | undefined) {
  const m: Record<string, "warning" | "info" | "success" | "error"> = { PENDING: "warning", CONFIRMED: "info", SHIPPED: "success", CANCELLED: "error", DELIVERED: "success", ARRIVED: "success", FAILED: "error" };
  return m[s || ""] || "default";
}

export default function SalesOrderDetail({ loaderData }: Route.ComponentProps) {
  const so = loaderData?.salesOrder;
  if (!so) return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Sales order not found.</Typography></Paper>;

  const order = so.order;
  const items: OrderItem[] = order.orderItems ?? [];

  return (
    <Box>
      <Button component={Link} to="/dashboard/sales-orders" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Sales Orders</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Sales Order Detail</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">SO#</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{so.orderId}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Status</Typography><Chip label={order.status} size="small" color={statusColor(order.status)} /></Grid></Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Customer</Typography>{so.customer ? <Box><Button component={Link} to={`/dashboard/customer/${so.customer.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{so.customer.name}</Button><Typography variant="caption" sx={{ fontFamily: "monospace", display: "block" }}>{so.customer.code}</Typography></Box> : <Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{so.customerId}</Typography>}</Grid>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Region</Typography>{so.region ? <Box><Button component={Link} to={`/dashboard/regions/${so.region.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{so.region.name}</Button><Typography variant="caption" sx={{ fontFamily: "monospace", display: "block" }}>{so.region.code}</Typography></Box> : <Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{so.regionId}</Typography>}</Grid>
        </Grid>
        <Box sx={{ mt: 2 }}><Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Order Date</Typography><Typography>{new Date(order.orderDate).toLocaleDateString()}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Total Amount</Typography><Typography variant="h5" sx={{ fontWeight: 600 }}>${Number(order.totalAmount).toLocaleString("en-US", { style: "currency", currency: "USD" })}</Typography></Grid></Grid></Box>
        {order.notes && <><Divider sx={{ my: 2 }} /><Typography variant="caption" color="text.secondary">Notes</Typography><Typography>{order.notes}</Typography></>}

        {items.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Order Items ({items.length})</Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead><TableRow><TableCell>Item</TableCell><TableCell align="right">Qty</TableCell><TableCell align="right">Unit Price</TableCell><TableCell align="right">Line Total</TableCell></TableRow></TableHead>
                <TableBody>{items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item ? <Button component={Link} to={`/dashboard/products/${item.item.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{item.item.name}</Button> : <Typography variant="body2" sx={{ fontFamily: "monospace" }}>{item.itemId}</Typography>}{item.item?.sku && <Typography variant="caption" sx={{ fontFamily: "monospace", display: "block", color: "text.secondary" }}>{item.item.sku}</Typography>}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${Number(item.unitPrice).toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>${Number(item.lineTotal).toLocaleString()}</TableCell>
                  </TableRow>
                ))}</TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Created</Typography><Typography variant="body2">{new Date(order.createdAt).toLocaleString()}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Updated</Typography><Typography variant="body2">{new Date(order.updatedAt).toLocaleString()}</Typography></Grid></Grid>
      </Paper>
    </Box>
  );
}
