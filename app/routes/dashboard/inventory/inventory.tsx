import { get, patch, post } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { useState } from "react";
import { Link, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "../+types/inventory";
import type { Inventory } from "~/types";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton, MenuItem, Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

function useRole() {
  const parent = useRouteLoaderData<{ accessToken: string }>("routes/dashboard/auth-guard");
  if (!parent?.accessToken) return "Consumer";
  try { return JSON.parse(atob(parent.accessToken.split(".")[1])).role; }
  catch { return "Consumer"; }
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const [invRes, productsRes, warehousesRes] = await Promise.all([
    get<{ data: { data: Inventory[]; total: number; page: number; limit: number } }>("/inventory?page=1&limit=50", token, cookie),
    get<{ data: { data: { id: string; name: string; sku: string }[] } }>("/product?page=1&limit=200", token, cookie),
    get<{ data: { data: { id: string; name: string; code: string }[] } }>("/warehouses?page=1&limit=200", token, cookie),
  ]);
  return { inventory: invRes.data.data, productOptions: productsRes.data.data, warehouseOptions: warehousesRes.data.data };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create-inventory" || intent === "update-inventory") {
    const body = { warehouseId: formData.get("warehouseId"), itemId: formData.get("itemId"), quantityOnHand: Number(formData.get("quantityOnHand")), reservedQuantity: Number(formData.get("reservedQuantity")), reorderLevel: Number(formData.get("reorderLevel")) };
    if (intent === "create-inventory") await post("/inventory", body, token, cookie);
    else await patch(`/inventory/${formData.get("id")}`, body, token, cookie);
    return { ok: true };
  }
  if (intent === "restock-inventory") {
    await post(`/inventory/${formData.get("id")}/restock`, { quantity: Number(formData.get("quantity")) }, token, cookie);
    return { ok: true };
  }
  return { ok: false, error: "Unknown intent" };
}

export default function InventorySection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const inventory = loaderData?.inventory ?? [];
  const productOptions = (loaderData?.productOptions as any[]) ?? [];
  const warehouseOptions = (loaderData?.warehouseOptions as any[]) ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({ itemId: "", warehouseId: "", quantityOnHand: "", reservedQuantity: "", reorderLevel: "" });
  const fetcher = useFetcher();
  const restockFetcher = useFetcher();
  const canMutate = role === "Admin" || role === "Employee";

  function openCreate() { setEditId(null); setForm({ itemId: "", warehouseId: "", quantityOnHand: "", reservedQuantity: "", reorderLevel: "" }); setDialogOpen(true); }
  function openEdit(inv: { id: string; warehouseId: string; itemId: string; quantityOnHand: number; reservedQuantity: number; reorderLevel: number; product?: { id: string; name: string; sku: string }; warehouse?: { id: string; name: string; code: string }; item?: { id: string; name: string; sku: string } }) {
    setEditId(inv.id);
    setForm({ itemId: inv.itemId || "", warehouseId: inv.warehouseId || "", quantityOnHand: String(inv.quantityOnHand), reservedQuantity: String(inv.reservedQuantity), reorderLevel: String(inv.reorderLevel) });
    setDialogOpen(true);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-inventory" : "create-inventory");
    if (editId) fd.set("id", editId);
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Inventory</Typography>
        {/*{canMutate && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Inventory</Button>}*/}
      </Box>
      {actionData?.error && <Typography color="error" sx={{ mb: 2 }}>{actionData.error}</Typography>}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell><TableCell>Warehouse</TableCell>
              <TableCell>Qty On Hand</TableCell><TableCell>Reserved</TableCell><TableCell>Reorder</TableCell>
              {canMutate && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.length === 0 && (
              <TableRow><TableCell colSpan={canMutate ? 6 : 5} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>No inventory records found.</Typography>
              </TableCell></TableRow>
            )}
            {inventory.map((inv: { id: string; warehouseId: string; itemId: string; quantityOnHand: number; reservedQuantity: number; reorderLevel: number; product?: { id: string; name: string; sku: string }; warehouse?: { id: string; name: string; code: string }; item?: { id: string; name: string; sku: string } }) => (
              <TableRow key={inv.id} hover>
                <TableCell><Link to={`/dashboard/inventory/${inv.id}`} style={{ textDecoration: "none", fontWeight: 500, color: "inherit" }}>{inv.item?.name ?? inv.itemId}</Link></TableCell>
                                <TableCell>{inv.warehouse?.name ?? inv.warehouseId}</TableCell>
                <TableCell>{inv.quantityOnHand}</TableCell>
                <TableCell>{inv.reservedQuantity}</TableCell>
                <TableCell>
                  <Chip label={inv.reorderLevel} size="small"
                    color={inv.quantityOnHand <= inv.reorderLevel ? "error" : "success"} variant="outlined" />
                </TableCell>
                {canMutate && (
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(inv)}><EditIcon fontSize="small" /></IconButton>
                    <restockFetcher.Form method="post" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginLeft: 8 }}>
                      <input type="hidden" name="intent" value="restock-inventory" />
                      <input type="hidden" name="id" value={inv.id} />
                      <TextField name="quantity" type="number" size="small" defaultValue={inv.reorderLevel}
                        sx={{ width: 70 }} slotProps={{ htmlInput: { style: { fontSize: "0.75rem", padding: "2px 4px" } } }} />
                      <Button type="submit" size="small" color="success" sx={{ fontSize: "0.75rem" }}>Restock</Button>
                    </restockFetcher.Form>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editId ? "Edit Inventory" : "New Inventory"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <TextField name="itemId" label="Product" select value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} required fullWidth>
              <MenuItem value="">Select item...</MenuItem>
              {productOptions.map((p: { id: string; name: string; sku: string; unitPrice: number }) => <MenuItem key={p.id} value={p.id}>{p.name} ({p.sku})</MenuItem>)}
            </TextField>
            <TextField name="warehouseId" label="Warehouse" select value={form.warehouseId} onChange={(e) => setForm({ ...form, warehouseId: e.target.value })} required fullWidth>
              <MenuItem value="">Select warehouse...</MenuItem>
              {warehouseOptions.map((w: { id: string; name: string; code: string }) => <MenuItem key={w.id} value={w.id}>{w.name} ({w.code})</MenuItem>)}
            </TextField>
            <TextField name="quantityOnHand" label="Qty On Hand" type="number" value={form.quantityOnHand} onChange={(e) => setForm({ ...form, quantityOnHand: e.target.value })} required fullWidth />
            <TextField name="reservedQuantity" label="Reserved Qty" type="number" value={form.reservedQuantity} onChange={(e) => setForm({ ...form, reservedQuantity: e.target.value })} required fullWidth />
            <TextField name="reorderLevel" label="Reorder Level" type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} required fullWidth />
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
