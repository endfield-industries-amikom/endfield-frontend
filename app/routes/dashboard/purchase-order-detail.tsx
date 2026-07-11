import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { Link } from "react-router";
import type { Route } from "./+types/purchase-order-detail";
import { Box, Paper, Typography, Button, Divider, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface PODetail { id: string; supplierId: string; warehouseId: string; supplier?: { id: string; name: string; code: string; email?: string }; warehouse?: { id: string; name: string; code: string }; orderDate: string; status: string; totalAmount: number; notes?: string; createdAt: string; updatedAt: string; orderItems?: { id: string; productId: string; product?: { id: string; name: string; sku: string }; quantity: number; unitPrice: number; totalPrice: number }[]; }

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: PODetail }>(`/purchase-order/${params.id}`, token, cookie);
  return { purchaseOrder: response.data };
}

function statusColor(s: string) { const m: Record<string, "warning" | "success" | "error" | "info"> = { PENDING: "warning", APPROVED: "success", REJECTED: "error", RECEIVED: "info" }; return m[s] || "default"; }

export default function PurchaseOrderDetail({ loaderData }: Route.ComponentProps) {
  const po = loaderData?.purchaseOrder;
  if (!po) return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Purchase order not found.</Typography></Paper>;

  return (
    <Box>
      <Button component={Link} to="/dashboard/purchase-orders" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Purchase Orders</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Purchase Order Detail</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}>
          <Grid size={6}><Typography variant="caption" color="text.secondary">PO#</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{po.id}</Typography></Grid>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Status</Typography><Chip label={po.status} size="small" color={statusColor(po.status)} /></Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Supplier</Typography>
            {po.supplier ? <Box><Button component={Link} to={`/dashboard/suppliers/${po.supplier.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{po.supplier.name}</Button><Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace", display: "block" }}>{po.supplier.code}</Typography></Box> : <Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{po.supplierId}</Typography>}
          </Grid>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Warehouse</Typography>
            {po.warehouse ? <Box><Button component={Link} to={`/dashboard/warehouses/${po.warehouse.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{po.warehouse.name}</Button><Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace", display: "block" }}>{po.warehouse.code}</Typography></Box> : <Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{po.warehouseId}</Typography>}
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}><Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Order Date</Typography><Typography>{new Date(po.orderDate).toLocaleDateString()}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Total Amount</Typography><Typography variant="h5" sx={{ fontWeight: 600 }}>{po.totalAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</Typography></Grid></Grid></Box>
        {po.notes && <><Divider sx={{ my: 2 }} /><Typography variant="caption" color="text.secondary">Notes</Typography><Typography>{po.notes}</Typography></>}
        {po.orderItems && po.orderItems.length > 0 && <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Order Items ({po.orderItems.length})</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead><TableRow><TableCell>Product</TableCell><TableCell align="right">Qty</TableCell><TableCell align="right">Unit Price</TableCell><TableCell align="right">Total</TableCell></TableRow></TableHead>
              <TableBody>{po.orderItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product ? <Button component={Link} to={`/dashboard/products/${item.product.id}`} size="small" sx={{ fontWeight: 600, p: 0 }}>{item.product.name}</Button> : <Typography sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{item.productId}</Typography>}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.unitPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{item.totalPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </TableContainer>
        </>}
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Created</Typography><Typography variant="body2">{new Date(po.createdAt).toLocaleString()}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Updated</Typography><Typography variant="body2">{new Date(po.updatedAt).toLocaleString()}</Typography></Grid></Grid>
      </Paper>
    </Box>
  );
}
