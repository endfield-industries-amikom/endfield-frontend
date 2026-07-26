import { useState } from "react";
import { Link, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "../+types/sales-orders";
import { get, patch, post } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, MenuItem, Chip, Card, CardContent, CardActions, Grid, Divider, Autocomplete, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DeleteIcon from "@mui/icons-material/Delete";
import type { SalesOrder, Shipment } from "~/types";

interface SelectOption { id: string; name: string; code: string; }
interface ItemOption { id: string; name: string; sku: string; unitPrice: number; }
interface LineItem { itemId: string; quantity: number; unitPrice: number; }
const emptyLine: LineItem = { itemId: "", quantity: 1, unitPrice: 0 };

function useRole() {
  const parent = useRouteLoaderData<{ accessToken: string }>("routes/dashboard/auth-guard");
  if (!parent?.accessToken) return "Consumer";
  try { return JSON.parse(atob(parent.accessToken.split(".")[1])).role; }
  catch { return "Consumer"; }
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  let role = "Consumer"; let email: string | null = null;
  try { const p = JSON.parse(atob(token.split(".")[1])); role = p.role || "Consumer"; email = p.email || null; } catch {}

  const [soRes, customersRes, regionsRes, productsRes] = await Promise.all([
    get<{ data: { data: SalesOrder[]; total: number } }>("/sales-order?page=1&limit=50", token, cookie),
    get<{ data: { data: SelectOption[] } }>("/customers?page=1&limit=200", token, cookie),
    get<{ data: { data: SelectOption[] } }>("/region?page=1&limit=200", token, cookie),
    get<{ data: { data: ItemOption[] } }>("/item?page=1&limit=200&isSellable=true", token, cookie),
  ]);

  let salesOrders = soRes.data.data;
  if (role === "Consumer" && email) {
    const match = customersRes.data.data.find((c: { email?: string; id: string }) => c.email?.toLowerCase() === email.toLowerCase());
    if (match) salesOrders = salesOrders.filter((so) => so.customerId === match.id);
    else salesOrders = [];
  }

  return { salesOrders, customerOptions: customersRes.data.data, regionOptions: regionsRes.data.data, productOptions: productsRes.data.data, userRole: role };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create-sales-order" || intent === "update-sales-order") {
    const itemsJson = formData.get("items") as string;
    const rawItems: LineItem[] = itemsJson ? JSON.parse(itemsJson) : [];
    const items = rawItems.map((item) => ({ orderType: "SALES", itemId: item.itemId, quantity: item.quantity, unitPrice: Number(item.unitPrice) }));
    const body: Record<string, unknown> = { notes: formData.get("notes") || undefined, items };
    const customerId = formData.get("customerId") as string;
    if (customerId) body.customerId = customerId;
    const regionId = formData.get("regionId") as string;
    if (regionId) body.regionId = regionId;
    if (intent === "create-sales-order") await post("/sales-order", body, token, cookie);
    else await patch(`/sales-order/${formData.get("id")}`, body, token, cookie);
    return { ok: true };
  }
  if (intent === "ship-order") {
    try {
      await post(`/sales-order/${formData.get("id")}/ship`, {}, token, cookie);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Shipment failed — check inventory" };
    }
  }
  if (intent === "confirm-order") {
    try {
      await post(`/sales-order/${formData.get("id")}/confirm`, {}, token, cookie);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : "Confirmation failed" };
    }
  }
  return { ok: false, error: "Unknown intent" };
}

function statusColor(s: string | undefined) { const m: Record<string, "warning" | "info" | "success" | "error"> = { PENDING: "warning", CONFIRMED: "info", SHIPPED: "success", CANCELLED: "error", DELIVERED: "success", FAILED: "error" }; return m[s || ""] || "default"; }

export default function SalesOrdersSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const salesOrders: SalesOrder[] = loaderData?.salesOrders ?? [];
  const customerOptions: SelectOption[] = loaderData?.customerOptions ?? [];
  const regionOptions: SelectOption[] = loaderData?.regionOptions ?? [];
  const productOptions: ItemOption[] = loaderData?.productOptions ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ customerId: "", regionId: "", notes: "" });
  const [lineItems, setLineItems] = useState<LineItem[]>([{ ...emptyLine }]);
  const fetcher = useFetcher();
  const shipFetcher = useFetcher();
  const confirmFetcher = useFetcher();
  const isAdmin = role === "Admin"; const isEmployee = role === "Employee"; const isConsumer = role === "Consumer";

  function openCreate() { setEditId(null); setForm({ customerId: "", regionId: "", notes: "" }); setLineItems([{ ...emptyLine }]); setDialogOpen(true); }
  function openEdit(so: SalesOrder) { setEditId(so.orderId); setForm({ customerId: so.customerId || "", regionId: so.regionId || "", notes: so.order.notes || "" });
    const existingItems: LineItem[] = (so.order.orderItems ?? []).map((oi) => ({ itemId: oi.itemId, quantity: oi.quantity, unitPrice: Number(oi.unitPrice) }));
    setLineItems(existingItems.length > 0 ? existingItems : [{ ...emptyLine }]); setDialogOpen(true); }

  function addLine() { setLineItems([...lineItems, { ...emptyLine }]); }
  function removeLine(idx: number) { setLineItems(lineItems.filter((_, i) => i !== idx)); }
  function updateLine(idx: number, field: keyof LineItem, value: string | number) {
    const updated = lineItems.map((l, i) => i === idx ? { ...l, [field]: value } : l);
    if (field === "itemId" && typeof value === "string") { const prod = productOptions.find((p) => p.id === value); if (prod) updated[idx].unitPrice = prod.unitPrice; }
    setLineItems(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-sales-order" : "create-sales-order");
    if (editId) fd.set("id", editId);
    fd.set("items", JSON.stringify(lineItems.filter((l) => l.itemId)));
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Sales Orders</Typography>
        {isConsumer && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Order</Button>}
      </Box>
      {actionData?.error && <Typography color="error" sx={{ mb: 2 }}>{actionData.error}</Typography>}
      {shipFetcher.data?.error && <Typography color="error" sx={{ mb: 2 }}>{(shipFetcher.data as { error?: string }).error}</Typography>}
      {confirmFetcher.data?.error && <Typography color="error" sx={{ mb: 2 }}>{(confirmFetcher.data as { error?: string }).error}</Typography>}
      {salesOrders.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}><Typography color="text.secondary">{isConsumer ? "You have no orders yet." : "No sales orders found."}</Typography></Card>
      ) : (
        <Grid container spacing={2}>
          {salesOrders.map((order) => (
            <Grid key={order.orderId} size={{ xs: 12, sm: 6 }}>
              <Card variant="outlined">
                <Box sx={{ p: 2, bgcolor: "grey.50", borderBottom: "1px dashed", borderColor: "divider", display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="subtitle2" component={Link} to={`/dashboard/sales-orders/${order.orderId}`} sx={{ fontWeight: 700, textDecoration: "none", color: "inherit", fontFamily: "monospace" }}>SO-{order.orderId.substring(0, 8)}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(order.order.orderDate).toLocaleDateString()}</Typography>
                  </Box>
                  <Chip label={order.order.status} size="small" color={statusColor(order.order.status)} />
                </Box>
                <CardContent sx={{ py: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}><Typography variant="body2" color="text.secondary">Customer:</Typography><Typography variant="body2">{order.customer?.name || order.customerId}</Typography></Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}><Typography variant="body2" color="text.secondary">Region:</Typography><Typography variant="body2">{order.region?.name || order.regionId}</Typography></Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography sx={{ fontWeight: 600 }}>Total:</Typography><Typography sx={{ fontWeight: 600 }}>${Number(order.order.totalAmount).toLocaleString()}</Typography></Box>
                </CardContent>
                {isConsumer && order.order.status === "PENDING" && (
                  <CardActions sx={{ borderTop: "1px solid", borderColor: "divider", px: 2, py: 1, bgcolor: "grey.50" }}>
                    <confirmFetcher.Form method="post">
                      <input type="hidden" name="intent" value="confirm-order" />
                      <input type="hidden" name="id" value={order.orderId} />
                      <Button size="small" type="submit" startIcon={<LocalShippingIcon fontSize="small" />} color="secondary">Confirm</Button>
                    </confirmFetcher.Form>
                  </CardActions>
                )}
                {((isAdmin || isEmployee) && order.order.status === "PENDING") && (
                  <CardActions sx={{ borderTop: "1px solid", borderColor: "divider", px: 2, py: 1, bgcolor: "grey.50" }}>
                    <Button size="small" startIcon={<EditIcon fontSize="small" />} onClick={() => openEdit(order)} sx={{ color: "text.secondary" }}>Edit</Button>
                  </CardActions>
                )}
                {(isAdmin || isEmployee) && order.order.status === "CONFIRMED" && (
                  <CardActions sx={{ borderTop: "1px solid", borderColor: "divider", px: 2, py: 1, bgcolor: "grey.50" }}>
                    <shipFetcher.Form method="post"><input type="hidden" name="intent" value="ship-order" /><input type="hidden" name="id" value={order.orderId} /><Button size="small" type="submit" startIcon={<LocalShippingIcon fontSize="small" />} color="success">Ship</Button></shipFetcher.Form>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editId ? "Edit Sales Order" : "New Sales Order"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            {!isConsumer && (
              <TextField name="customerId" label="Customer" select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} required fullWidth>
                <MenuItem value="">Select customer...</MenuItem>
                {customerOptions.map((c) => <MenuItem key={c.id} value={c.id}>{c.name} ({c.code})</MenuItem>)}
              </TextField>
            )}
            <TextField name="regionId" label="Region" select value={form.regionId} onChange={(e) => setForm({ ...form, regionId: e.target.value })} required fullWidth>
              <MenuItem value="">Select region...</MenuItem>
              {regionOptions.map((r) => <MenuItem key={r.id} value={r.id}>{r.name} ({r.code})</MenuItem>)}
            </TextField>
            <TextField name="notes" label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} fullWidth multiline rows={2} />
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Line Items</Typography><Button size="small" startIcon={<AddIcon />} onClick={addLine}>Add Item</Button></Box>
            {lineItems.map((item, idx) => (
              <Box key={idx} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Autocomplete size="small" options={productOptions} getOptionLabel={(opt) => `${opt.name} (${opt.sku})`} value={productOptions.find((p) => p.id === item.itemId) || null} onChange={(_, val) => updateLine(idx, "itemId", val?.id || "")} sx={{ flex: 2 }} renderInput={(params) => <TextField {...params} label="Item" />} />
                <TextField size="small" label="Qty" type="number" value={item.quantity} onChange={(e) => updateLine(idx, "quantity", Number(e.target.value))} sx={{ width: 80 }} slotProps={{ htmlInput: { min: 1 } }} />
                <TextField size="small" label="Price" type="number" value={item.unitPrice} onChange={(e) => updateLine(idx, "unitPrice", Number(e.target.value))} sx={{ width: 120 }} slotProps={{ htmlInput: { step: "0.01" } }} />
                <IconButton size="small" color="error" onClick={() => removeLine(idx)}><DeleteIcon fontSize="small" /></IconButton>
              </Box>
            ))}
            {lineItems.filter((l) => l.itemId).length > 0 && (<Typography variant="body2" color="text.secondary">Total: ${lineItems.filter((l) => l.itemId).reduce((sum, l) => sum + l.quantity * l.unitPrice, 0).toLocaleString()}</Typography>)}
          </DialogContent>
          <DialogActions><Button variant="outlined" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" variant="contained">{editId ? "Update" : "Create"}</Button></DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
