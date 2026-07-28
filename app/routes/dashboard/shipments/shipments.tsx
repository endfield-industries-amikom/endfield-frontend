import { Suspense, useState } from "react";
import { Await, useFetcher, useNavigate, useRouteLoaderData } from "react-router";
import SkeletonTable from "~/components/SkeletonTable";
import type { Route } from "./+types/shipments";
import { get, patch, post } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import type { Shipment } from "~/types";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, MenuItem, Chip } from "@mui/material";
import ErrorPopup from "~/components/error";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

interface OrderOption { orderId: string; order: { status: string }; }

function parseRole(token: string): string {
  try { return JSON.parse(atob(token.split(".")[1])).role || "Consumer"; }
  catch { return "Consumer"; }
}

/* ------------------------------------------------------------------ */
/*  Loader – role-aware data fetching                                  */
/* ------------------------------------------------------------------ */

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const role = parseRole(token);

  const dataPromise = (role === "Consumer"
    ? Promise.all([
        get<{ data: { data: Shipment[]; total: number } }>("/shipment?page=1&limit=50", token, cookie),
        get<{ data: { data: OrderOption[] } }>("/sales-order?page=1&limit=200", token, cookie),
      ]).then(([shipRes, soRes]) => ({
        shipments: (shipRes.data.data ?? []).filter((s: Shipment) => s.orderType === "SALES"),
        poOptions: [] as OrderOption[],
        soOptions: soRes.data.data ?? [],
        userRole: "Consumer" as const,
      }))
    : Promise.all([
        get<{ data: { data: Shipment[]; total: number } }>("/shipment?page=1&limit=50", token, cookie),
        get<{ data: { data: OrderOption[] } }>("/purchase-order?page=1&limit=200", token, cookie),
        get<{ data: { data: OrderOption[] } }>("/sales-order?page=1&limit=200", token, cookie),
      ]).then(([shipRes, poRes, soRes]) => ({
        shipments: shipRes.data.data,
        poOptions: (poRes.data.data ?? []).filter((o: OrderOption) => o.order?.status === "APPROVED"),
        soOptions: (soRes.data.data ?? []).filter((o: OrderOption) => o.order?.status === "SHIPPED"),
        userRole: role,
      }))
  );

  return { data: dataPromise };
}

/* ------------------------------------------------------------------ */
/*  Action                                                              */
/* ------------------------------------------------------------------ */

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
    if (intent === "create-shipment" || intent === "update-shipment") {
      const body: Record<string, unknown> = {
        orderType: formData.get("orderType"),
        orderId: formData.get("orderId"),
        carrier: formData.get("carrier") || undefined,
        trackingNumber: formData.get("trackingNumber") || undefined,
        status: formData.get("status") || "PENDING",
      };
      if (intent === "create-shipment") await post("/shipment", body, token, cookie);
      else await patch(`/shipment/${formData.get("id")}`, body, token, cookie);
      return { ok: true };
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

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                      */
/* ------------------------------------------------------------------ */

function statusColor(s: string) {
  const m: Record<string, "warning" | "info" | "success" | "error"> = { PENDING: "warning", SENDING: "info", ARRIVED: "success", CANCELLED: "error", FAILED: "error" };
  return m[s] || "default";
}

/* ------------------------------------------------------------------ */
/*  Consumer table – links to sales-order, no Type column              */
/* ------------------------------------------------------------------ */

function ConsumerShipmentsTable({ shipments }: { shipments: Shipment[] }) {
  const navigate = useNavigate();
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order#</TableCell>
            <TableCell>Carrier</TableCell>
            <TableCell>Tracking</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>No shipments found.</Typography>
              </TableCell>
            </TableRow>
          )}
          {shipments.map((s) => (
            <TableRow key={s.id} hover onClick={() => navigate(`/dashboard/sales-orders/${s.orderId}`)} sx={{ cursor: "pointer" }}>
              <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                SO-{s.orderId?.substring(0, 8) || "—"}
              </TableCell>
              <TableCell>{s.carrier || "—"}</TableCell>
              <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{s.trackingNumber || "—"}</TableCell>
              <TableCell><Chip label={s.status} size="small" color={statusColor(s.status)} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Admin/Employee table – full columns, edit action, detail link      */
/* ------------------------------------------------------------------ */

function AdminShipmentsTable({
  shipments,
  canMutate,
  onEdit,
}: {
  shipments: Shipment[];
  canMutate: boolean;
  onEdit: (s: Shipment) => void;
}) {
  const navigate = useNavigate();
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Shipment#</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Order#</TableCell>
            <TableCell>Carrier</TableCell>
            <TableCell>Tracking</TableCell>
            <TableCell>Status</TableCell>
            {canMutate && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments.length === 0 && (
            <TableRow>
              <TableCell colSpan={canMutate ? 7 : 6} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>No shipments found.</Typography>
              </TableCell>
            </TableRow>
          )}
          {shipments.map((s) => (
            <TableRow key={s.id} hover onClick={(e) => {
                           if ((e.target as HTMLElement).closest("button,a,input,textarea,select")) return;
                           navigate(`/dashboard/shipments/${s.id}`);
                         }} sx={{ cursor: "pointer" }}>
              <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{s.id.substring(0, 8)}</TableCell>
              <TableCell><Chip label={s.orderType} size="small" variant="outlined" /></TableCell>
              <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{s.orderId?.substring(0, 8) || "—"}</TableCell>
              <TableCell>{s.carrier || "—"}</TableCell>
              <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>{s.trackingNumber || "—"}</TableCell>
              <TableCell><Chip label={s.status} size="small" color={statusColor(s.status)} /></TableCell>
              {canMutate && (
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onEdit(s)}><EditIcon fontSize="small" /></IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component – role-based rendering                              */
/* ------------------------------------------------------------------ */

export default function ShipmentsSection({ loaderData, actionData }: Route.ComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<"PURCHASE" | "SALES">("PURCHASE");
  const [form, setForm] = useState({ orderId: "", carrier: "", trackingNumber: "", status: "PENDING" });
  const fetcher = useFetcher();
  const fetcherData = fetcher.data as { ok?: boolean; error?: string; errorRaw?: Error } | undefined;
  const actionError =
    fetcherData?.ok === false
      ? fetcherData
      : actionData?.ok === false
        ? actionData
        : null;

  function openCreate() { setEditId(null); setOrderType("PURCHASE"); setForm({ orderId: "", carrier: "", trackingNumber: "", status: "PENDING" }); setDialogOpen(true); }
  function openEdit(s: Shipment) { setEditId(s.id); setOrderType(s.orderType as "PURCHASE" | "SALES"); setForm({ orderId: s.orderId || "", carrier: s.carrier || "", trackingNumber: s.trackingNumber || "", status: s.status || "PENDING" }); setDialogOpen(true); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-shipment" : "create-shipment");
    if (editId) fd.set("id", editId);
    fd.set("orderType", orderType);
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  return (
    <Box>
      {actionError && (
        <ErrorPopup
          message={actionError.error as string}
          error={(actionError as any).errorRaw}
        />
      )}

      <Suspense fallback={<SkeletonTable columns={4} />}>
        <Await resolve={(loaderData as any).data}>
          {({ shipments, poOptions, soOptions, userRole }: { shipments: Shipment[]; poOptions: OrderOption[]; soOptions: OrderOption[]; userRole: string }) => {
            const canMutate = userRole === "Admin" || userRole === "Employee";
            const currentOrderOptions = orderType === "PURCHASE" ? poOptions : soOptions;
            return (<>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {userRole === "Consumer" ? "My Shipments" : "Shipments"}
                </Typography>
                {canMutate && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Shipment</Button>}
              </Box>

              {userRole === "Consumer" ? (
                <ConsumerShipmentsTable shipments={shipments} />
              ) : (
                <AdminShipmentsTable shipments={shipments} canMutate={canMutate} onEdit={openEdit} />
              )}

              {canMutate && (
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                  <form onSubmit={handleSubmit}>
                    <DialogTitle>{editId ? "Edit Shipment" : "New Shipment"}</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
                      <TextField name="orderType" label="Order Type" select value={orderType}
                        onChange={(e) => { setOrderType(e.target.value as "PURCHASE" | "SALES"); setForm({ ...form, orderId: "" }); }} required fullWidth>
                        <MenuItem value="PURCHASE">Purchase Order</MenuItem>
                        <MenuItem value="SALES">Sales Order</MenuItem>
                      </TextField>
                      <TextField name="orderId" label="Order" select value={form.orderId}
                        onChange={(e) => setForm({ ...form, orderId: e.target.value })} required fullWidth>
                        <MenuItem value="">Select order...</MenuItem>
                        {currentOrderOptions.map((o) => (
                          <MenuItem key={o.orderId} value={o.orderId}>
                            {`${orderType === "PURCHASE" ? "PO" : "SO"}-${o.orderId.substring(0, 8)}`}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField name="carrier" label="Carrier" value={form.carrier}
                        onChange={(e) => setForm({ ...form, carrier: e.target.value })} fullWidth />
                      <TextField name="trackingNumber" label="Tracking Number" value={form.trackingNumber}
                        onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} fullWidth />
                      <TextField name="status" label="Status" select value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })} fullWidth>
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="SENDING">Sending</MenuItem>
                        <MenuItem value="ARRIVED">Arrived</MenuItem>
                      </TextField>
                    </DialogContent>
                    <DialogActions>
                      <Button variant="outlined" onClick={() => setDialogOpen(false)}>Cancel</Button>
                      <Button type="submit" variant="contained">{editId ? "Update" : "Create"}</Button>
                    </DialogActions>
                  </form>
                </Dialog>
              )}
            </>);
          }}
        </Await>
      </Suspense>
    </Box>
  );
}
