import { get, patch, post } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { useState } from "react";
import { Link, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/purchase-orders";
import type { PurchaseOrder } from "~/services/types";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, IconButton, MenuItem, Chip, Card, CardContent, CardActions, Grid, Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

function useRole() {
  const parent = useRouteLoaderData<{ accessToken: string }>("routes/dashboard/auth-guard");
  if (!parent?.accessToken) return "Consumer";
  try { return JSON.parse(atob(parent.accessToken.split(".")[1])).role; }
  catch { return "Consumer"; }
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const [poRes, suppliersRes, warehousesRes] = await Promise.all([
    get<{ data: { data: PurchaseOrder[]; total: number; page: number; limit: number } }>("/purchase-order?page=1&limit=50", token, cookie),
    get<{ data: { data: { id: string; name: string; code: string }[] } }>("/supplier?page=1&limit=200", token, cookie),
    get<{ data: { data: { id: string; name: string; code: string }[] } }>("/warehouses?page=1&limit=200", token, cookie),
  ]);
  return { purchaseOrders: poRes.data.data, supplierOptions: suppliersRes.data.data, warehouseOptions: warehousesRes.data.data };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create-purchase-order" || intent === "update-purchase-order") {
    const body = { supplierId: formData.get("supplierId"), warehouseId: formData.get("warehouseId"), notes: formData.get("notes") || undefined };
    if (intent === "create-purchase-order") await post("/purchase-order", body, token, cookie);
    else await patch(`/purchase-order/${formData.get("id")}`, body, token, cookie);
    return { ok: true };
  }
  if (intent === "approve-po") {
    await post(`/purchase-order/${formData.get("id")}/approve`, {}, token, cookie);
    return { ok: true };
  }
  return { ok: false, error: "Unknown intent" };
}

function statusColor(s: string) { const m: Record<string, "warning" | "success" | "error" | "info"> = { PENDING: "warning", APPROVED: "success", REJECTED: "error", RECEIVED: "info" }; return m[s] || "default"; }

export default function PurchaseOrdersSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const purchaseOrders = loaderData?.purchaseOrders ?? [];
  const supplierOptions = (loaderData?.supplierOptions as any[]) ?? [];
  const warehouseOptions = (loaderData?.warehouseOptions as any[]) ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ supplierId: "", warehouseId: "", notes: "" });
  const fetcher = useFetcher();
  const approveFetcher = useFetcher();
  const canMutate = role === "Admin" || role === "Employee";
  const isAdmin = role === "Admin";

  function openCreate() { setEditId(null); setForm({ supplierId: "", warehouseId: "", notes: "" }); setDialogOpen(true); }
  function openEdit(po: any) { setEditId(po.id); setForm({ supplierId: po.supplierId || "", warehouseId: po.warehouseId || "", notes: po.notes || "" }); setDialogOpen(true); }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-purchase-order" : "create-purchase-order");
    if (editId) fd.set("id", editId);
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Purchase Orders</Typography>
        {canMutate && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Purchase Order</Button>}
      </Box>
      {actionData?.error && <Typography color="error" sx={{ mb: 2 }}>{actionData.error}</Typography>}
      {purchaseOrders.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}><Typography color="text.secondary">No purchase orders found.</Typography></Card>
      ) : (
        <Grid container spacing={2}>
          {purchaseOrders.map((order: any) => (
            <Grid key={order.id} size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined">
                <Box sx={{ p: 2, bgcolor: "grey.50", borderBottom: "1px dashed", borderColor: "divider", display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="subtitle2" component={Link} to={`/dashboard/purchase-orders/${order.id}`}
                                          sx={{ fontWeight: 700, textDecoration: "none", color: "inherit", fontFamily: "monospace" }}>
                      PO-{order.id.substring(0, 8)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(order.orderDate).toLocaleDateString()}</Typography>
                  </Box>
                  <Chip label={order.status} size="small" color={statusColor(order.status)} />
                </Box>
                <CardContent sx={{ py: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <Typography variant="body2" color="text.secondary">Supplier:</Typography>
                    <Typography variant="body2">{order.supplier?.name || order.supplierId}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <Typography variant="body2" color="text.secondary">Warehouse:</Typography>
                    <Typography variant="body2">{order.warehouse?.name || order.warehouseId}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 600 }}>Total:</Typography>
                    <Typography sx={{ fontWeight: 600 }}>${Number(order.totalAmount).toLocaleString()}</Typography>
                  </Box>
                </CardContent>
                {canMutate && (
                  <CardActions sx={{ borderTop: "1px solid", borderColor: "divider", px: 2, py: 1, bgcolor: "grey.50" }}>
                    <Button size="small" startIcon={<EditIcon fontSize="small" />} onClick={() => openEdit(order)} sx={{ color: "text.secondary" }}>Edit</Button>
                    {isAdmin && order.status === "PENDING" && (
                      <approveFetcher.Form method="post">
                        <input type="hidden" name="intent" value="approve-po" />
                        <input type="hidden" name="id" value={order.id} />
                        <Button size="small" type="submit" startIcon={<CheckIcon fontSize="small" />} color="success">Approve</Button>
                      </approveFetcher.Form>
                    )}
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editId ? "Edit Purchase Order" : "New Purchase Order"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <TextField name="supplierId" label="Supplier" select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} required fullWidth>
              <MenuItem value="">Select supplier...</MenuItem>
              {supplierOptions.map((s: any) => <MenuItem key={s.id} value={s.id}>{s.name} ({s.code})</MenuItem>)}
            </TextField>
            <TextField name="warehouseId" label="Warehouse" select value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })} required fullWidth>
              <MenuItem value="">Select warehouse...</MenuItem>
              {warehouseOptions.map((w: any) => <MenuItem key={w.id} value={w.id}>{w.name} ({w.code})</MenuItem>)}
            </TextField>
            <TextField name="notes" label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} fullWidth multiline rows={2} />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editId ? "Update" : "Create"}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
