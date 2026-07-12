import { get, patch, post, del } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { useState } from "react";
import { Link, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/regions";
import type { Region } from "~/services/types";
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
  const response = await get<{ data: { data: Region[]; total: number; page: number; limit: number } }>(
    "/region?page=1&limit=50", token, cookie,
  );
  return { regions: response.data.data };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create-region" || intent === "update-region") {
    const body = { name: formData.get("name"), code: formData.get("code"), description: formData.get("description") || undefined };
    if (intent === "create-region") await post("/region", body, token, cookie);
    else await patch(`/region/${formData.get("id")}`, body, token, cookie);
    return { ok: true };
  }
  if (intent === "delete-region") {
    await del(`/region/${formData.get("id")}`, token, cookie);
    return { ok: true };
  }
  return { ok: false, error: "Unknown intent" };
}

const emptyForm = { name: "", code: "", description: "" };

export default function RegionsSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const regions = loaderData?.regions ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fetcher = useFetcher();
  const canMutate = role === "Admin";

  function openCreate() { setEditId(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(r: Region) { setEditId(r.id); setForm({ name: r.name, code: r.code, description: r.description || "" }); setDialogOpen(true); }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-region" : "create-region");
    if (editId) fd.set("id", editId);
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Regions</Typography>
        {canMutate && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Region</Button>}
      </Box>
      {actionData?.error && <Typography color="error" sx={{ mb: 2 }}>{actionData.error}</Typography>}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell><TableCell>Code</TableCell><TableCell>Description</TableCell>
              {canMutate && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {regions.length === 0 && (
              <TableRow><TableCell colSpan={canMutate ? 4 : 3} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>No regions found.</Typography>
              </TableCell></TableRow>
            )}
            {regions.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell><Link to={`/dashboard/regions/${r.id}`} style={{ textDecoration: "none", fontWeight: 500, color: "inherit" }}>{r.name}</Link></TableCell>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{r.code}</TableCell>
                <TableCell>{r.description || "—"}</TableCell>
                {canMutate && (
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(r)}><EditIcon fontSize="small" /></IconButton>
                    <fetcher.Form method="post" style={{ display: "inline" }}>
                      <input type="hidden" name="intent" value="delete-region" />
                      <input type="hidden" name="id" value={r.id} />
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
          <DialogTitle>{editId ? "Edit Region" : "New Region"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <TextField name="name" label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required fullWidth />
            <TextField name="code" label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required fullWidth />
            <TextField name="description" label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={2} />
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
