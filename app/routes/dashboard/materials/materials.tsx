import { get, patch, post, del } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { Suspense, useEffect, useRef, useState } from "react";
import SkeletonTable from "~/components/SkeletonTable";
import { useNavigate, useFetcher, useRouteLoaderData, Await } from "react-router";
import type { Route } from "./+types/materials";
import type { Material } from "~/types";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton, Checkbox, FormControlLabel,
  Snackbar, Alert,
} from "@mui/material";
import ErrorPopup from "~/components/error";
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
  const materialsPromise = get<{ data: { data: Material[]; total: number; page: number; limit: number } }>(
    "/material?page=1&limit=50", token, cookie,
  ).then((r) => r.data.data);
  return { materials: materialsPromise };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
    if (intent === "create-material" || intent === "update-material") {
      const body: Record<string, unknown> = {
        name: formData.get("name"),
        sku: formData.get("sku"),
        description: formData.get("description") || undefined,
        category: formData.get("category") || undefined,
        capacityUsage: Number(formData.get("capacityUsage")) || undefined,
        unitPrice: Number(formData.get("unitPrice")),
        isSellable: formData.get("isSellable") === "on",
        isPurchaseable: formData.get("isPurchaseable") === "on",
      };
      if (intent === "create-material") { await post("/material", body, token, cookie); return { ok: true, intent }; }
      else { await patch(`/material/${formData.get("id")}`, body, token, cookie); return { ok: true, intent }; }
    }
    if (intent === "delete-material") {
      await del(`/material/${formData.get("id")}`, token, cookie);
      return { ok: true, intent };
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

const emptyForm = { name: "", sku: "", description: "", category: "", capacityUsage: "", unitPrice: "", isSellable: true, isPurchaseable: true };

export default function MaterialsSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const prevFetcherState = useRef(fetcher.state);

  useEffect(() => {
    if (prevFetcherState.current === "loading" && fetcher.state === "idle" && fetcher.data?.ok) {
      const messages: Record<string, string> = {
        "create-material": "Material created successfully.",
        "update-material": "Material updated successfully.",
        "delete-material": "Material deleted successfully.",
      };
      setSuccessMsg(messages[fetcher.data.intent] || "Operation completed.");
    }
    prevFetcherState.current = fetcher.state;
  }, [fetcher.state, fetcher.data]);
  const fetcherData = fetcher.data as { ok?: boolean; error?: string; errorRaw?: Error } | undefined;
  const actionError =
    fetcherData?.ok === false
      ? fetcherData
      : actionData?.ok === false
        ? actionData
        : null;
  const canMutate = role === "Admin" || role === "Employee";

  function openCreate() { setEditId(null); setForm(emptyForm); setDialogOpen(true); }
  function openEdit(m: Material) { setEditId(m.id); setForm({ name: m.item?.name || "", sku: m.item?.sku || "", description: m.item?.description || "", category: m.item?.category || "", capacityUsage: String(m.item?.capacityUsage ?? ""), unitPrice: String(m.item?.unitPrice || ""), isSellable: m.item?.isSellable ?? true, isPurchaseable: m.item?.isPurchaseable ?? true }); setDialogOpen(true); }
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
      {actionError && (
        <ErrorPopup
          message={actionError.error as string}
          error={(actionError as any).errorRaw}
        />
      )}
      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity="success" variant="filled" onClose={() => setSuccessMsg(null)} sx={{ width: "100%" }}>
          {successMsg}
        </Alert>
      </Snackbar>
      <Suspense fallback={<SkeletonTable columns={canMutate ? 6 : 5} />}>
        <Await resolve={(loaderData as any).materials}>
          {(materials: Material[]) => (
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
                    <TableRow key={m.id} hover sx={{cursor: "pointer"}} onClick={(e) => {
                                     if ((e.target as HTMLElement).closest("button,a,input,textarea,select")) return;
                                     navigate(`/dashboard/materials/${m.id}`);
                                   }}>
                      <TableCell>{m.item?.name}</TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{m.item?.sku}</TableCell>
                      <TableCell>{m.item?.category || "\u2014"}</TableCell>
                      <TableCell>{m.item?.capacityUsage ?? "\u2014"}</TableCell>
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
          )}
        </Await>
      </Suspense>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editId ? "Edit Material" : "New Material"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <TextField name="name" label="Material Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required fullWidth />
            <TextField name="sku" label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required fullWidth />
            <TextField name="description" label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={2} />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                          <TextField name="category" label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth />
                          <TextField name="capacityUsage" label="Capacity Usage" type="number" value={form.capacityUsage} onChange={(e) => setForm({ ...form, capacityUsage: e.target.value })} fullWidth slotProps={{ htmlInput: { step: "0.01", min: "0" } }} />
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
