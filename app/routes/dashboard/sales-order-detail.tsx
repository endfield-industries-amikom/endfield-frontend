import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { Link } from "react-router";
import type { Route } from "./+types/sales-order-detail";
import { Box, Paper, Typography, Button, Divider, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface SODetail { id: string; customerId: string; warehouseId: string; customer?: { id: string; name: string; code: string; email?: string }; warehouse?: { id: string; name: string; code: string }; orderDate: string; status: string; totalAmount: number; notes?: string; createdAt: string; updatedAt: string; orderItems?: { id: string; productId: string; product?: { id: string; name: string; sku: string }; quantity: number; unitPrice: number; totalPrice: number }[]; }

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: SODetail }>(`/sales-order/${params.id}`, token, cookie);
  return { salesOrder: response.data };
}

function statusColor(s: string) { const m: Record<string, "warning" | "info" | "success" | "error"> = { PENDING: "warning", CONFIRMED: "info", SHIPPED: "success", CANCELLED: "error", DELIVERED: "success" }; return m[s] || "default"; }

export default function SalesOrderDetail({ loaderData }: Route.ComponentProps) {
  const so = loaderData?.salesOrder;
  if (!so) return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Sales order not found.</Typography></Paper>;

  return (
    <Box>
      <Button component={Link} to="/dashboard/sales-orders" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Sales Orders</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Sales Order Detail</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">SO#</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{so.id}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Status</Typography><Chip label={so.status} size="small" color={statusColor(so.status)} /></Grid></Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Customer</Typography>{so.customer ? <Box><Button component={Link} to={`/dashboard/customers/${so.customer.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{so.customer.name}</Button><Typography variant="caption" sx={{ fontFamily: "monospace", display: "block" }}>{so.customer.code}</Typography></Box> : <Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{so.customerId}</Typography>}</Grid>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Warehouse</Typography>{so.warehouse ? <Box><Button component={Link} to={`/dashboard/warehouses/${so.warehouse.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{so.warehouse.name}</Button><Typography variant="caption" sx={{ fontFamily: "monospace", display: "block" }}>{so.warehouse.code}</Typography></Box> : <Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{so.warehouseId}</Typography>}</Grid>
        </Grid>
        <Box sx={{ mt: 2 }}><Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Order Date</Typography><Typography>{new Date(so.orderDate).toLocaleDateString()}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Total Amount</Typography><Typography variant="h5" sx={{ fontWeight: 600 }}>{so.totalAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</Typography></Grid></Grid></Box>
        {so.notes && <><Divider sx={{ my: 2 }} /><Typography variant="caption" color="text.secondary">Notes</Typography><Typography>{so.notes}</Typography></>}
        {so.orderItems && so.orderItems.length > 0 && <>
          <Divider sx={{ my: 2 }} /><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Order Items ({so.orderItems.length})</Typography>
          <TableContainer component={Paper} variant="outlined"><Table size="small">
            <TableHead><TableRow><TableCell>Product</TableCell><TableCell align="right">Qty</TableCell><TableCell align="right">Unit Price</TableCell><TableCell align="right">Total</TableCell></TableRow></TableHead>
            <TableBody>{so.orderItems.map((item) => (<TableRow key={item.id}><TableCell>{item.product ? <Button component={Link} to={`/dashboard/products/${item.product.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{item.product.name}</Button> : <Typography sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{item.productId}</Typography>}</TableCell><TableCell align="right">{item.quantity}</TableCell><TableCell align="right">{item.unitPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell><TableCell align="right" sx={{ fontWeight: 600 }}>{item.totalPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell></TableRow>))}</TableBody>
          </Table></TableContainer>
        </>}
        <Divider sx={{ my: 2 }} /><Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Created</Typography><Typography variant="body2">{new Date(so.createdAt).toLocaleString()}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Updated</Typography><Typography variant="body2">{new Date(so.updatedAt).toLocaleString()}</Typography></Grid></Grid>
      </Paper>
    </Box>
  );
}
