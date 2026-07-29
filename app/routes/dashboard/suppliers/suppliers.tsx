import { get, patch, post, del } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { Suspense, useEffect, useRef, useState } from "react";
import { Await, Link, useFetcher, useNavigate, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/suppliers";
import type { Supplier } from "~/types";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton, Snackbar, Alert,
} from "@mui/material";
import ErrorPopup from "~/components/error";
import SkeletonTable from "~/components/SkeletonTable";
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
  const suppliersPromise = get<{ data: { data: Supplier[]; total: number; page: number; limit: number } }>(
    "/supplier?page=1&limit=50", token, cookie,
  ).then((r) => r.data.data);
  return { suppliers: suppliersPromise };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
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
    return { ok: true, intent };
  }
  if (intent === "delete-supplier") {
    await del(`/supplier/${formData.get("id")}`, token, cookie);
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

const emptyForm = { name: "", code: "", contactPerson: "", email: "", phone: "", address: "" };

export default function SuppliersSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const fetcher = useFetcher();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const prevFetcherState = useRef(fetcher.state);

  useEffect(() => {
    if (prevFetcherState.current === "loading" && fetcher.state === "idle" && fetcher.data?.ok) {
      const messages: Record<string, string> = {
        "create-supplier": "Supplier created successfully.",
        "update-supplier": "Supplier updated successfully.",
        "delete-supplier": "Supplier deleted successfully.",
      };
      setSuccessMsg(messages[(fetcher.data as any).intent] || "Operation completed.");
    }
    prevFetcherState.current = fetcher.state;
  }, [fetcher.state, fetcher.data]);
  const fetcherData = fetcher.data as { ok?: boolean; error?: string; errorRaw?: Error } | undefined;
  const navigate = useNavigate();
  const actionError =
    fetcherData?.ok === false
      ? fetcherData
      : actionData?.ok === false
        ? actionData
        : null;
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
      {actionError && (
        <ErrorPopup
          message={actionError.error as string}
          error={(actionError as any).errorRaw}
        />
      )}
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessMsg(null)} severity="success" variant="filled" sx={{ width: "100%" }}>
          {successMsg}
        </Alert>
      </Snackbar>
      <Suspense fallback={<SkeletonTable columns={canMutate ? 5 : 4} />}>
        <Await resolve={(loaderData as any).suppliers}>
          {(suppliers: Supplier[]) => (
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
                    <TableRow key={s.id} hover sx={{ cursor: "pointer" }} onClick={() => navigate(`/dashboard/suppliers/${s.id}`)}>
                      <TableCell>{s.name}</TableCell>
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
          )}
        </Await>
      </Suspense>
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
