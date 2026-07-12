import { get, patch, post, del } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { useState } from "react";
import { Link, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/materials";
import type { Material } from "~/types";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton, Checkbox, FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function useRole() {
  const parent = useRouteLoaderData<{ accessToken: string }>("routes/dashboard/auth-guard");
  if (!parent?.accessToken) return "Consumer";
  try { return JSON.parse(atob(parent.accessToken.split(".")[1])).role; }
  catch { return "Consumer"; }
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: { data: Material[]; total: number; page: number; limit: number } }>(
    "/material?page=1&limit=50", token, cookie,
  );
  return { materials: response.data.data };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create-material" || intent === "update-material") {
    const body: Record<string, unknown> = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      description: formData.get("description") || undefined,
      category: formData.get("category") || undefined,
      unit: formData.get("unit") || undefined,
      unitPrice: Number(formData.get("unitPrice")),
      isSellable: formData.get("isSellable") === "on",
      isPurchaseable: formData.get("isPurchaseable") === "on",
    };
    if (intent === "create-material") await post("/material", body, token, cookie);
    else await patch(`/material/${formData.get("id")}`, body, token, cookie);
    return { ok: true };
  }
  if (intent === "delete-material") {
    await del(`/material/${formData.get("id")}`, token, cookie);
    return { ok: true };
  }
  return { ok: false, error: "Unknown intent" };
}

const emptyForm = { name: "", sku: "", description: "", category: "", unit: "", unitPrice: "", isSellable: true, isPurchaseable: true };

export default function MaterialsSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const materials = loaderData?.materials ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fetcher = useFetcher();
  const canMutate = role === "Admin" || role === "Employee";

  function openCreate() { setEditId(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(m: Material) { setEditId(m.id); setForm({ name: m.item?.name || "", sku: m.item?.sku || "", description: m.item?.description || "", category: m.item?.category || "", unit: m.unit || "", unitPrice: String(m.item?.unitPrice || ""), isSellable: m.item?.isSellable ?? true, isPurchaseable: m.item?.isPurchaseable ?? true }); setDialogOpen(true); }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-material" : "create-material");
    if (editId) fd.set("id", editId);
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Materials</Typography>
        {canMutate && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Material</Button>}
      </Box>
      {actionData?.error && <Typography color="error" sx={{ mb: 2 }}>{actionData.error}</Typography>}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell><TableCell>SKU</TableCell><TableCell>Category</TableCell>
              <TableCell>Unit</TableCell><TableCell>Price</TableCell>
              {canMutate && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.length === 0 && (
              <TableRow><TableCell colSpan={canMutate ? 6 : 5} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>No materials found.</Typography>
              </TableCell></TableRow>
            )}
            {materials.map((m) => (
              <TableRow key={m.id} hover>
                <TableCell><Link to={`/dashboard/materials/${m.id}`} style={{ textDecoration: "none", fontWeight: 500, color: "inherit" }}>{m.item?.name}</Link></TableCell>
                                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{m.item?.sku}</TableCell>
                                <TableCell>{m.item?.category || "—"}</TableCell>
                                <TableCell>{m.unit || "—"}</TableCell>
                                <TableCell>{(Number(m.item?.unitPrice) || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell>
                {canMutate && (
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(m)}><EditIcon fontSize="small" /></IconButton>
                    <fetcher.Form method="post" style={{ display: "inline" }}>
                      <input type="hidden" name="intent" value="delete-material" />
                      <input type="hidden" name="id" value={m.id} />
                      <IconButton size="small" type="submit" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </fetcher.Form>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editId ? "Edit Material" : "New Material"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <TextField name="name" label="Material Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required fullWidth />
            <TextField name="sku" label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required fullWidth />
            <TextField name="description" label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={2} />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField name="category" label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth />
              <TextField name="unit" label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} fullWidth />
            </Box>
            <TextField name="unitPrice" label="Unit Price" type="number" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required fullWidth slotProps={{ htmlInput: { step: "0.01" } }} />

            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControlLabel
                control={<Checkbox name="isSellable" checked={form.isSellable}
                  onChange={(e) => setForm({ ...form, isSellable: e.target.checked })} />}
                label="Sellable" />
              <FormControlLabel
                control={<Checkbox name="isPurchaseable" checked={form.isPurchaseable}
                  onChange={(e) => setForm({ ...form, isPurchaseable: e.target.checked })} />}
                label="Purchasable" />
            </Box>
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
