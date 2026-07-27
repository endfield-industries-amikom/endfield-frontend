import { useState } from "react";
import { Link, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/purchase-orders";
import { get, patch, post } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import type { PurchaseOrder } from "~/types";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, IconButton, MenuItem, Chip, Card, CardContent, CardActions, Grid, Divider, Autocomplete } from "@mui/material";
import ErrorPopup from "~/components/error";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [poRes, suppliersRes, warehousesRes, productsRes] = await Promise.all([
    get<{ data: { data: PurchaseOrder[] } }>("/purchase-order?page=1&limit=50", token, cookie),
    get<{ data: { data: SelectOption[] } }>("/supplier?page=1&limit=200", token, cookie),
    get<{ data: { data: SelectOption[] } }>("/warehouses?page=1&limit=200", token, cookie),
    get<{ data: { data: ItemOption[] } }>("/item?page=1&limit=200&isPurchaseable=true", token, cookie),
  ]);
  return { purchaseOrders: poRes.data.data, supplierOptions: suppliersRes.data.data, warehouseOptions: warehousesRes.data.data, productOptions: productsRes.data.data };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
    if (intent === "create-purchase-order" || intent === "update-purchase-order") {
      const itemsJson = formData.get("items") as string;
      const rawItems: LineItem[] = itemsJson ? JSON.parse(itemsJson) : [];
      const items = rawItems.map((item) => ({ orderType: "PURCHASE", itemId: item.itemId, quantity: item.quantity, unitPrice: Number(item.unitPrice) }));
      const body = { supplierId: formData.get("supplierId"), warehouseId: formData.get("warehouseId"), notes: formData.get("notes") || undefined, items };
      if (intent === "create-purchase-order") await post("/purchase-order", body, token, cookie);
      else await patch(`/purchase-order/${formData.get("id")}`, body, token, cookie);
      return { ok: true };
    }
    if (intent === "approve-po") {
      try {
        await post(`/purchase-order/${formData.get("id")}/approve`, {}, token, cookie);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : "Approval failed" };
      }
    }
    return { ok: false, error: "Unknown intent" };
  } catch (err) {
    const message =
      (err as any)?.response?.message ||
      (err as any)?.data?.message ||
      (err as Error)?.message ||
      "Action failed. Please try again.";
    return { ok: false, error: message, errorRaw: err as Error | undefined };
  }
}

function statusColor(s: string | undefined) {
  const m: Record<string, "warning" | "success" | "error" | "info"> = { PENDING: "warning", APPROVED: "success", REJECTED: "error", RECEIVED: "info", ARRIVED: "success", FAILED: "error" };
  return m[s || ""] || "default";
}

export default function PurchaseOrdersSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const purchaseOrders: PurchaseOrder[] = loaderData?.purchaseOrders ?? [];
  const supplierOptions: SelectOption[] = loaderData?.supplierOptions ?? [];
  const warehouseOptions: SelectOption[] = loaderData?.warehouseOptions ?? [];
  const productOptions: ItemOption[] = loaderData?.productOptions ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ supplierId: "", warehouseId: "", notes: "" });
  const [lineItems, setLineItems] = useState<LineItem[]>([{ ...emptyLine }]);
  const fetcher = useFetcher();
  const fetcherData = fetcher.data as { ok?: boolean; error?: string; errorRaw?: Error } | undefined;
  const actionError =
    fetcherData?.ok === false
      ? fetcherData
      : actionData?.ok === false
        ? actionData
        : null;
  const approveFetcher = useFetcher();
  const canMutate = role === "Admin" || role === "Employee";
  const isAdmin = role === "Admin";

  function openCreate() { setEditId(null); setForm({ supplierId: "", warehouseId: "", notes: "" }); setLineItems([{ ...emptyLine }]); setDialogOpen(true); }
  function openEdit(po: PurchaseOrder) { setEditId(po.orderId); setForm({ supplierId: po.supplierId || "", warehouseId: po.warehouseId || "", notes: po.order.notes || "" });
      const existingItems: LineItem[] = (po.order.orderItems ?? []).map((oi) => ({ itemId: oi.itemId, quantity: oi.quantity, unitPrice: Number(oi.unitPrice) }));
      setLineItems(existingItems.length > 0 ? existingItems : [{ ...emptyLine }]);
      setDialogOpen(true); }

  function addLine() { setLineItems([...lineItems, { ...emptyLine }]); }
  function removeLine(idx: number) { setLineItems(lineItems.filter((_, i) => i !== idx)); }
  function updateLine(idx: number, field: keyof LineItem, value: string | number) {
    const updated = lineItems.map((l, i) => i === idx ? { ...l, [field]: value } : l);
    if (field === "itemId" && typeof value === "string") {
      const prod = productOptions.find((p) => p.id === value);
      if (prod) updated[idx].unitPrice = prod.unitPrice;
    }
    setLineItems(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-purchase-order" : "create-purchase-order");
    if (editId) fd.set("id", editId);
    fd.set("items", JSON.stringify(lineItems.filter((l) => l.itemId)));
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Purchase Orders</Typography>
        {canMutate && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Purchase Order</Button>}
      </Box>
      {actionError && (
        <ErrorPopup
          message={actionError.error as string}
          error={(actionError as any).errorRaw}
        />
      )}
      {purchaseOrders.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center" }}><Typography color="text.secondary">No purchase orders found.</Typography></Card>
      ) : (
        <Grid container spacing={2}>
          {purchaseOrders.map((order) => (
                      <Grid key={order.orderId} size={{ xs: 12, sm: 6 }}>
                        <Card variant="outlined">
                          <Box sx={{ p: 2, bgcolor: "grey.50", borderBottom: "1px dashed", borderColor: "divider", display: "flex", justifyContent: "space-between" }}>
                            <Box>
                              <Typography variant="subtitle2" component={Link} to={`/dashboard/purchase-orders/${order.orderId}`} sx={{ fontWeight: 700, textDecoration: "none", color: "inherit", fontFamily: "monospace" }}>
                                PO-{order.orderId.substring(0, 8)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">{new Date(order.order.orderDate).toLocaleDateString()}</Typography>
                            </Box>
                            <Chip label={order.order.status} size="small" color={statusColor(order.order.status)} />
                          </Box>
                          <CardContent sx={{ py: 1.5 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}><Typography variant="body2" color="text.secondary">Supplier:</Typography><Typography variant="body2">{order.supplier?.name || order.supplierId}</Typography></Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}><Typography variant="body2" color="text.secondary">Warehouse:</Typography><Typography variant="body2">{order.warehouse?.name || order.warehouseId}</Typography></Box>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography sx={{ fontWeight: 600 }}>Total:</Typography><Typography sx={{ fontWeight: 600 }}>${Number(order.order.totalAmount).toLocaleString()}</Typography></Box>
                          </CardContent>
                {canMutate && order.order.status === "PENDING" && (
                  <CardActions sx={{ borderTop: "1px solid", borderColor: "divider", px: 2, py: 1, bgcolor: "grey.50" }}>
                    <Button size="small" startIcon={<EditIcon fontSize="small" />} onClick={() => openEdit(order)} sx={{ color: "text.secondary" }}>Edit</Button>
                    {isAdmin && order.order.status === "PENDING" && (
                      <approveFetcher.Form method="post">
                        <input type="hidden" name="intent" value="approve-po" />
                        <input type="hidden" name="id" value={order.orderId} />
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editId ? "Edit Purchase Order" : "New Purchase Order"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <TextField name="supplierId" label="Supplier" select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })} required fullWidth>
              <MenuItem value="">Select supplier...</MenuItem>
              {supplierOptions.map((s) => <MenuItem key={s.id} value={s.id}>{s.name} ({s.code})</MenuItem>)}
            </TextField>
            <TextField name="warehouseId" label="Warehouse" select value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })} required fullWidth>
              <MenuItem value="">Select warehouse...</MenuItem>
              {warehouseOptions.map((w) => <MenuItem key={w.id} value={w.id}>{w.name} ({w.code})</MenuItem>)}
            </TextField>
            <TextField name="notes" label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} fullWidth multiline rows={2} />
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Line Items</Typography>
              <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={addLine}>Add Item</Button>
            </Box>
            {lineItems.map((item, idx) => (
              <Box key={idx} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Autocomplete size="small" options={productOptions} getOptionLabel={(opt) => `${opt.name} (${opt.sku})`} value={productOptions.find((p) => p.id === item.itemId) || null} onChange={(_, val) => updateLine(idx, "itemId", val?.id || "")} sx={{ flex: 2 }} renderInput={(params) => <TextField {...params} label="Item" />} />
                <TextField size="small" label="Qty" type="number" value={item.quantity} onChange={(e) => updateLine(idx, "quantity", Number(e.target.value))} sx={{ width: 80 }} slotProps={{ htmlInput: { min: 1 } }} />
                <TextField size="small" label="Price" type="number" value={item.unitPrice} onChange={(e) => updateLine(idx, "unitPrice", Number(e.target.value))} sx={{ width: 120 }} slotProps={{ htmlInput: { step: "0.01" } }} />
                <IconButton size="small" color="error" onClick={() => removeLine(idx)}><DeleteIcon fontSize="small" /></IconButton>
              </Box>
            ))}
            {lineItems.filter((l) => l.itemId).length > 0 && (
              <Typography variant="body2" color="text.secondary">Total: ${lineItems.filter((l) => l.itemId).reduce((sum, l) => sum + l.quantity * l.unitPrice, 0).toLocaleString()}</Typography>
            )}
          </DialogContent>
          <DialogActions><Button variant="outlined" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" variant="contained">{editId ? "Update" : "Create"}</Button></DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
