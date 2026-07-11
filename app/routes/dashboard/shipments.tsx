import { get, patch, post } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { useState } from "react";
import { Link, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/shipments";
import type { Shipment } from "~/services/types";
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
  const [shipRes, poRes, soRes] = await Promise.all([
    get<{ data: { data: Shipment[]; total: number; page: number; limit: number } }>("/shipment?page=1&limit=50", token, cookie),
    get<{ data: { data: { id: string }[] } }>("/purchase-order?page=1&limit=200", token, cookie),
    get<{ data: { data: { id: string }[] } }>("/sales-order?page=1&limit=200", token, cookie),
  ]);
  return { shipments: shipRes.data.data, poOptions: poRes.data.data, soOptions: soRes.data.data };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create-shipment" || intent === "update-shipment") {
    const body: Record<string, unknown> = { poId: formData.get("poId"), carrier: formData.get("carrier") || undefined, trackingNumber: formData.get("trackingNumber") || undefined, status: formData.get("status") || "PENDING" };
    const salesOrderId = formData.get("salesOrderId") as string;
    if (salesOrderId) body.salesOrderId = salesOrderId;
    if (intent === "create-shipment") await post("/shipment", body, token, cookie);
    else await patch(`/shipment/${formData.get("id")}`, body, token, cookie);
    return { ok: true };
  }
  return { ok: false, error: "Unknown intent" };
}

function statusColor(s: string) { const m: Record<string, "warning" | "info" | "success" | "error"> = { PENDING: "warning", IN_TRANSIT: "info", DELIVERED: "success", CANCELLED: "error" }; return m[s] || "default"; }

export default function ShipmentsSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const shipments = loaderData?.shipments ?? [];
  const poOptions = (loaderData?.poOptions as any[]) ?? [];
  const soOptions = (loaderData?.soOptions as any[]) ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ poId: "", salesOrderId: "", carrier: "", trackingNumber: "", status: "PENDING" });
  const fetcher = useFetcher();
  const canMutate = role === "Admin" || role === "Employee";

  function openCreate() { setEditId(null); setForm({ poId: "", salesOrderId: "", carrier: "", trackingNumber: "", status: "PENDING" }); setDialogOpen(true); }
  function openEdit(s: any) { setEditId(s.id); setForm({ poId: s.poId || "", salesOrderId: s.salesOrderId || "", carrier: s.carrier || "", trackingNumber: s.trackingNumber || "", status: s.status || "PENDING" }); setDialogOpen(true); }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-shipment" : "create-shipment");
    if (editId) fd.set("id", editId);
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Shipments</Typography>
        {canMutate && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Shipment</Button>}
      </Box>
      {actionData?.error && <Typography color="error" sx={{ mb: 2 }}>{actionData.error}</Typography>}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Shipment#</TableCell><TableCell>PO#</TableCell><TableCell>SO#</TableCell>
              <TableCell>Carrier</TableCell><TableCell>Tracking</TableCell><TableCell>Status</TableCell>
              {canMutate && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.length === 0 && (
              <TableRow><TableCell colSpan={canMutate ? 7 : 6} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>No shipments found.</Typography>
              </TableCell></TableRow>
            )}
            {shipments.map((s: any) => (
              <TableRow key={s.id} hover>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                  <Link to={`/dashboard/shipments/${s.id}`} style={{ textDecoration: "none", color: "inherit" }}>{s.id}</Link>
                </TableCell>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{s.purchaseOrder?.id ?? s.poId}</TableCell>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{s.salesOrder?.id ?? s.salesOrderId ?? "—"}</TableCell>
                <TableCell>{s.carrier || "—"}</TableCell>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{s.trackingNumber || "—"}</TableCell>
                <TableCell><Chip label={s.status} size="small" color={statusColor(s.status)} /></TableCell>
                {canMutate && (
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(s)}><EditIcon fontSize="small" /></IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editId ? "Edit Shipment" : "New Shipment"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <TextField name="poId" label="Purchase Order" select value={form.poId} onChange={(e) => setForm({ ...form, poId: e.target.value })} required fullWidth>
              <MenuItem value="">Select PO...</MenuItem>
              {poOptions.map((po: any) => <MenuItem key={po.id} value={po.id}>{po.id}</MenuItem>)}
            </TextField>
            <TextField name="salesOrderId" label="Sales Order (optional)" select value={form.salesOrderId} onChange={(e) => setForm({ ...form, salesOrderId: e.target.value })} fullWidth>
              <MenuItem value="">Select SO...</MenuItem>
              {soOptions.map((so: any) => <MenuItem key={so.id} value={so.id}>{so.id}</MenuItem>)}
            </TextField>
            <TextField name="carrier" label="Carrier" value={form.carrier} onChange={(e) => setForm({ ...form, carrier: e.target.value })} fullWidth />
            <TextField name="trackingNumber" label="Tracking Number" value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} fullWidth />
            <TextField name="status" label="Status" select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} fullWidth>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
              <MenuItem value="DELIVERED">Delivered</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">{editId ? "Update" : "Create"}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
