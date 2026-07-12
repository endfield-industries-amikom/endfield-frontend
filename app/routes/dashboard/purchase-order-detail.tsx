import { Link } from "react-router";
import type { Route } from "./+types/purchase-order-detail";
import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import type { PurchaseOrder, OrderItem } from "~/types";
import { Box, Paper, Typography, Button, Divider, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: PurchaseOrder }>(`/purchase-order/${params.id}`, token, cookie);
  return { purchaseOrder: response.data };
}

function statusColor(s: string | undefined) {
  const m: Record<string, "warning" | "success" | "error" | "info"> = { PENDING: "warning", APPROVED: "success", REJECTED: "error", RECEIVED: "info" };
  return m[s || ""] || "default";
}

export default function PurchaseOrderDetail({ loaderData }: Route.ComponentProps) {
  const po = loaderData?.purchaseOrder;
  if (!po) return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Purchase order not found.</Typography></Paper>;

  const order = po.order;
  const items: OrderItem[] = order.orderItems ?? [];

  return (
    <Box>
      <Button component={Link} to="/dashboard/purchase-orders" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Purchase Orders</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Purchase Order Detail</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}>
          <Grid size={6}><Typography variant="caption" color="text.secondary">PO#</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{po.orderId}</Typography></Grid>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Status</Typography><Chip label={order.status} size="small" color={statusColor(order.status)} /></Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Supplier</Typography>
            {po.supplier ? <Box><Button component={Link} to={`/dashboard/suppliers/${po.supplier.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{po.supplier.name}</Button><Typography variant="caption" sx={{ fontFamily: "monospace", display: "block" }}>{po.supplier.code}</Typography></Box> : <Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{po.supplierId}</Typography>}
          </Grid>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Warehouse</Typography>
            {order.warehouse ? <Box><Button component={Link} to={`/dashboard/warehouses/${order.warehouse.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{order.warehouse.name}</Button><Typography variant="caption" sx={{ fontFamily: "monospace", display: "block" }}>{order.warehouse.code}</Typography></Box> : <Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{order.warehouseId}</Typography>}
          </Grid>
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
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.item ? (
                          <Button component={Link} to={`/dashboard/products/${item.item.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{item.item.name}</Button>
                        ) : (
                          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>{item.itemId}</Typography>
                        )}
                        {item.item?.sku && <Typography variant="caption" sx={{ fontFamily: "monospace", display: "block", color: "text.secondary" }}>{item.item.sku}</Typography>}
                      </TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">${Number(item.unitPrice).toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>${Number(item.lineTotal).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
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
