import { get, patch, post } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { useState } from "react";
import { Link, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/suppliers";
import type { Supplier } from "~/services/types";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton,
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
  const response = await get<{ data: { data: Supplier[]; total: number; page: number; limit: number } }>(
    "/supplier?page=1&limit=50", token, cookie,
  );
  return { suppliers: response.data.data };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create-supplier" || intent === "update-supplier") {
    const body = {
      name: formData.get("name"), code: formData.get("code"),
      contactPerson: formData.get("contactPerson") || undefined,
      email: formData.get("email") || undefined,
      phone: formData.get("phone") || undefined,
      address: formData.get("address") || undefined,
    };
    if (intent === "create-supplier") await post("/supplier", body, token, cookie);
    else await patch(`/supplier/${formData.get("id")}`, body, token, cookie);
    return { ok: true };
  }
  if (intent === "delete-supplier") {
    await post(`/supplier/${formData.get("id")}/delete`, {}, token, cookie);
    return { ok: true };
  }
  return { ok: false, error: "Unknown intent" };
}

const emptyForm = { name: "", code: "", contactPerson: "", email: "", phone: "", address: "" };

export default function SuppliersSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const suppliers = loaderData?.suppliers ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fetcher = useFetcher();
  const canMutate = role === "Admin";

  function openCreate() { setEditId(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(s: Supplier) {
    setEditId(s.id);
    setForm({ name: s.name, code: s.code, contactPerson: s.contactPerson || "", email: s.email || "", phone: s.phone || "", address: s.address || "" });
    setDialogOpen(true);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-supplier" : "create-supplier");
    if (editId) fd.set("id", editId);
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Suppliers</Typography>
        {canMutate && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Supplier</Button>}
      </Box>
      {actionData?.error && <Typography color="error" sx={{ mb: 2 }}>{actionData.error}</Typography>}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell><TableCell>Code</TableCell><TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>{canMutate && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.length === 0 && (
              <TableRow><TableCell colSpan={canMutate ? 5 : 4} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>No suppliers found.</Typography>
              </TableCell></TableRow>
            )}
            {suppliers.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell><Link to={`/dashboard/suppliers/${s.id}`} style={{ textDecoration: "none", fontWeight: 500, color: "inherit" }}>{s.name}</Link></TableCell>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{s.code}</TableCell>
                <TableCell>{s.contactPerson || "—"}</TableCell>
                <TableCell>{s.email || "—"}</TableCell>
                {canMutate && (
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(s)}><EditIcon fontSize="small" /></IconButton>
                    <fetcher.Form method="post" style={{ display: "inline" }}>
                      <input type="hidden" name="intent" value="delete-supplier" />
                      <input type="hidden" name="id" value={s.id} />
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
          <DialogTitle>{editId ? "Edit Supplier" : "New Supplier"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <TextField name="name" label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required fullWidth />
            <TextField name="code" label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required fullWidth />
            <TextField name="contactPerson" label="Contact Person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} fullWidth />
            <TextField name="email" label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} fullWidth />
            <TextField name="phone" label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} fullWidth />
            <TextField name="address" label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} fullWidth multiline rows={2} />
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
