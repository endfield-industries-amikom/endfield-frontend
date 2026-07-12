import { get, patch, post, del } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { useState } from "react";
import { Link, useFetcher, useNavigate, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/warehouses";
import type { Warehouse } from "~/types";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton, MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

/* ------------------------------------------------------------------ */
/*  Role helper                                                        */
/* ------------------------------------------------------------------ */

function useRole() {
  const parent = useRouteLoaderData<{ accessToken: string }>(
    "routes/dashboard/auth-guard",
  );
  if (!parent?.accessToken) return "Consumer";
  try {
    return JSON.parse(atob(parent.accessToken.split(".")[1])).role;
  } catch {
    return "Consumer";
  }
}

/* ------------------------------------------------------------------ */
/*  Loader                                                             */
/* ------------------------------------------------------------------ */

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const [warehousesRes, regionsRes] = await Promise.all([
    get<{ data: { data: Warehouse[]; total: number; page: number; limit: number } }>(
      "/warehouses?page=1&limit=50",
      token,
      cookie,
    ),
    get<{ data: { data: { id: string; name: string }[] } }>(
      "/region?page=1&limit=200",
      token,
      cookie,
    ),
  ]);
  return {
    warehouses: warehousesRes.data.data,
    regionOptions: regionsRes.data.data,
  };
}

/* ------------------------------------------------------------------ */
/*  Action                                                             */
/* ------------------------------------------------------------------ */

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create-warehouse" || intent === "update-warehouse") {
    const body: Record<string, unknown> = {
      name: formData.get("name"),
      code: formData.get("code"),
      address: formData.get("address") || undefined,
    };
    const regionId = formData.get("regionId") as string;
    if (regionId) body.regionId = regionId;
    const maxCapacity = formData.get("maxCapacity") as string;
    if (maxCapacity) body.maxCapacity = Number(maxCapacity);

    if (intent === "create-warehouse") {
      await post("/warehouses", body, token, cookie);
    } else {
      const id = formData.get("id") as string;
      await patch(`/warehouses/${id}`, body, token, cookie);
    }
    return { ok: true };
  }

  if (intent === "delete-warehouse") {
    const id = formData.get("id") as string;
    await del(`/warehouses/${id}`, token, cookie);
    return { ok: true };
  }

  return { ok: false, error: "Unknown intent" };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const emptyForm = { name: "", code: "", address: "", regionId: "", maxCapacity: "" };

export default function WarehousesSection({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const role = useRole();
  const warehouses = loaderData?.warehouses ?? [];
  const regionOptions = (loaderData?.regionOptions as any[]) ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const deleteFetcher = useFetcher();

  const canMutate = role === "Admin";

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(w: any) {
    setEditId(w.id);
    setForm({
      name: w.name || "",
      code: w.code || "",
      address: w.address || "",
      regionId: w.regionId || "",
      maxCapacity: w.maxCapacity != null ? String(w.maxCapacity) : "",
    });
    setDialogOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-warehouse" : "create-warehouse");
    if (editId) fd.set("id", editId);
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Warehouses</Typography>
        {canMutate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New Warehouse
          </Button>
        )}
      </Box>

      {actionData?.error && (
        <Typography color="error" sx={{ mb: 2 }}>{actionData.error}</Typography>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Capacity</TableCell>
              {canMutate && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouses.length === 0 && (
              <TableRow>
                <TableCell colSpan={canMutate ? 5 : 4} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>No warehouses found.</Typography>
                </TableCell>
              </TableRow>
            )}
            {warehouses.map((w:Warehouse) => (
              <TableRow key={w.id} hover onClick={() => navigate(`/dashboard/warehouses/${w.id}`)} sx={{cursor: "pointer"}}>
                <TableCell sx={{ color: "inherit", textDecoration: "none", fontWeight: 500 }}>
                  {w.name}
                </TableCell>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{w.code}</TableCell>
                <TableCell>{w.address || "—"}</TableCell>
                <TableCell>
                  {w.maxCapacity != null
                    ? `${w.currentLoad ?? "—"} / ${w.maxCapacity}`
                    : "—"}
                </TableCell>
                {canMutate && (
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(w)}><EditIcon fontSize="small" /></IconButton>
                    <deleteFetcher.Form method="post" style={{ display: "inline" }}>
                      <input type="hidden" name="intent" value="delete-warehouse" />
                      <input type="hidden" name="id" value={w.id} />
                      <IconButton size="small" type="submit" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </deleteFetcher.Form>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editId ? "Edit Warehouse" : "New Warehouse"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <TextField name="name" label="Warehouse Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required fullWidth />
            <TextField name="code" label="Code" value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })} required fullWidth />
            <TextField name="regionId" label="Region" select value={form.regionId}
              onChange={(e) => setForm({ ...form, regionId: e.target.value })} fullWidth>
              <MenuItem value="">Select region...</MenuItem>
              {regionOptions.map((r: { id: string; name: string; code: string }) => (
                <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
              ))}
            </TextField>
            <TextField name="address" label="Address" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })} fullWidth />
            <TextField name="maxCapacity" label="Max Capacity" type="number" value={form.maxCapacity}
              onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })}
              fullWidth helperText="Maximum storage capacity (units)" slotProps={{ htmlInput: { min: 0 } }} />
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
