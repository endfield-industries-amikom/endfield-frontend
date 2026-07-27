import { get, patch, post } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { useState } from "react";
import { Link, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/schematics";
import type { ProductionSchematic, Item } from "~/types";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, IconButton, Chip, Card, CardContent, CardActions, MenuItem, Select, InputLabel, FormControl, Grid, Autocomplete, Checkbox, FormControlLabel } from "@mui/material";
import ErrorPopup from "~/components/error";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import FactoryIcon from "@mui/icons-material/Factory";
import { Article } from "@mui/icons-material";

interface ItemOption { id: string; name: string; sku: string; unitPrice: number; isManufactureable?: boolean; }
interface MaterialInput { productId: string; quantity: number; }
interface WarehouseOption { id: string; name: string; code: string; }

function useRole() {
  const parent = useRouteLoaderData<{ accessToken: string }>("routes/dashboard/auth-guard");
  if (!parent?.accessToken) return "Consumer";
  try { return JSON.parse(atob(parent.accessToken.split(".")[1])).role; }
  catch { return "Consumer"; }
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const [schematicsRes, itemsRes, warehousesRes] = await Promise.all([
    get<{ data: { data: ProductionSchematic[]; total: number; page: number; limit: number } }>("/production-schematic?page=1&limit=50", token, cookie),
    get<{ data: { data: (ItemOption & { isManufactureable?: boolean })[] } }>("/item?page=1&limit=200", token, cookie),
    get<{ data: { data: WarehouseOption[] } }>("/warehouses?page=1&limit=200", token, cookie),
  ]);
  const allItems = itemsRes.data.data ?? [];
  return {
    schematics: schematicsRes.data.data,
    productOptions: allItems,
    outputProductOptions: allItems.filter((p) => p.isManufactureable !== false),
    warehouseOptions: warehousesRes.data.data ?? [],
  };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
    if (intent === "create-schematic" || intent === "update-schematic") {
      const materialsStr = (formData.get("materials") as string) || "";
      const materialPairs = materialsStr.split(",").map((s) => s.trim()).filter(Boolean);
      const inputs: string[] = [];
      const inputQty: number[] = [];
      for (const pair of materialPairs) {
        const [pid, qtyStr] = pair.split(":");
        const cleanId = pid?.trim();
        const qty = Number(qtyStr);
        if (cleanId && !isNaN(qty) && qty > 0) { inputs.push(cleanId); inputQty.push(qty); }
      }
      const warehouseIdsStr = (formData.get("warehouseIds") as string) || "";
      const warehouseIds = warehouseIdsStr ? warehouseIdsStr.split(",").filter(Boolean) : [];

      const body = {
        name: formData.get("name"),
        type: formData.get("type"),
        inputs,
        inputQty,
        duration: Number(formData.get("duration")),
        outputQty: Number(formData.get("outputQty")),
        outputItemId: formData.get("outputItemId"),
        active: formData.get("active") === "on",
        warehouseIds,
      };

      if (intent === "create-schematic") await post("/production-schematic", body, token, cookie);
      else await patch(`/production-schematic/${formData.get("id")}`, body, token, cookie);
      return { ok: true };
    }
    if (intent === "produce-schematic") {
      const id = formData.get("id") as string;
      const warehouseId = formData.get("warehouseId") as string;
      const schematicId = formData.get("schematicId") as string;
      try {
        await post(`/production-schematic/${schematicId}/produce`, { warehouseId, schematicId }, token, cookie);
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : "Production failed — check warehouse inventory" };
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

export default function SchematicsSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const schematics: ProductionSchematic[] = loaderData?.schematics ?? [];
  const productOptions: ItemOption[] = loaderData?.productOptions ?? [];
  const outputProductOptions: ItemOption[] = (loaderData?.outputProductOptions ?? productOptions) as ItemOption[];
  const warehouseOptions: WarehouseOption[] = loaderData?.warehouseOptions ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", type: "", duration: "", outputQty: "", outputItemId: "", active: false });
  const [selectedWarehouseIds, setSelectedWarehouseIds] = useState<string[]>([]);
  const [materialInputs, setMaterialInputs] = useState<MaterialInput[]>([{ productId: "", quantity: 1 }]);
  const fetcher = useFetcher();
  const fetcherData = fetcher.data as { ok?: boolean; error?: string; errorRaw?: Error } | undefined;
  const actionError =
    fetcherData?.ok === false
      ? fetcherData
      : actionData?.ok === false
        ? actionData
        : null;
  const produceFetcher = useFetcher();
  const canMutate = role === "Admin" || role === "Employee";

  function handleProduce(schematicId: string, warehouseId: string) {
    const fd = new FormData();
    fd.set("intent", "produce-schematic");
    fd.set("schematicId", schematicId);
    fd.set("warehouseId", warehouseId);
    produceFetcher.submit(fd, { method: "post" });
  }

  const productMap = new Map(productOptions.map((p) => [p.id, p]));
  function getProductName(id: string): string { const p = productMap.get(id); return p ? `${p.name} (${p.sku})` : id; }

  function openCreate() {
    setEditId(null);
    setForm({ name: "", type: "", duration: "", outputQty: "", outputItemId: "", active: false });
    setSelectedWarehouseIds([]);
    setMaterialInputs([{ productId: "", quantity: 1 }]);
    setDialogOpen(true);
  }
  function openEdit(s: ProductionSchematic) {
    setEditId(s.id);
    setForm({ name: s.name || "", type: s.type || "", duration: String(s.duration || 0), outputQty: String(s.outputQty || 0), outputItemId: s.outputItemId || "", active: s.active ?? false });
    setSelectedWarehouseIds(s.warehouseIds ?? []);
    const materials: MaterialInput[] = (s.inputs || []).map((pid, i) => ({ productId: pid, quantity: s.inputQty?.[i] ?? 1 }));
    setMaterialInputs(materials.length > 0 ? materials : [{ productId: "", quantity: 1 }]);
    setDialogOpen(true);
  }

  function addMaterialRow() { setMaterialInputs([...materialInputs, { productId: "", quantity: 1 }]); }
  function removeMaterialRow(index: number) { setMaterialInputs(materialInputs.filter((_, i) => i !== index)); }
  function updateMaterial(index: number, field: keyof MaterialInput, value: string | number) {
    setMaterialInputs(materialInputs.map((m, i) => i === index ? { ...m, [field]: value } : m));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-schematic" : "create-schematic");
    if (editId) fd.set("id", editId);
    const materialsStr = materialInputs.filter((m) => m.productId).map((m) => `${m.productId}:${m.quantity}`).join(",");
    fd.set("materials", materialsStr);
    fd.set("warehouseIds", selectedWarehouseIds.join(","));
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Production Schematics</Typography>
        {canMutate && <Button variant="contained" sx={{ bgcolor: "#f59e0b", "&:hover": { bgcolor: "#d97706" } }} startIcon={<AddIcon />} onClick={openCreate}>New Schematic</Button>}
      </Box>
      {actionError && (
        <ErrorPopup
          message={actionError.error as string}
          error={(actionError as any).errorRaw}
        />
      )}
      {produceFetcher.data?.ok && (
        <Typography color="success.main" sx={{ mb: 2 }}>Production started successfully.</Typography>
      )}
      {schematics.length === 0 ? (
        <Card sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}><Typography color="text.secondary">No schematics found.</Typography></Card>
      ) : (
        <Grid container spacing={2}>
          {schematics.map((s) => (
            <Grid key={s.id} size={{ xs: 12, sm: 6, md: 4 }} >
              <Card sx={{ bgcolor: "#fffbeb", border: "1px solid", borderColor: "#fde68a", position: "relative", overflow: "visible" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Box>
                      <Typography variant="subtitle1" component={Link} to={`/dashboard/schematics/${s.id}`} sx={{ fontWeight: 700, color: "#92400e", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>{s.name}</Typography>
                      <Typography variant="caption" color="#b45309" sx={{ textTransform: "uppercase", p: 2 }}>{s.type}</Typography>
                    </Box>
                    <Chip label={s.active ? "Active" : "Inactive"} size="small" color={s.active ? "success" : "default"} />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, fontSize: "0.85rem", color: "text.secondary" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}><span>Duration:</span><Typography component="span" sx={{ fontWeight: 500 }}>{s.duration}s</Typography></Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}><span>Output:</span><Typography component="span" sx={{ fontWeight: 500 }}>{s.outputQty}× {s.outputItem?.name || s.outputItemId}</Typography></Box>
                    {s.inputs?.length > 0 && (
                      <Box><Typography variant="caption" color="text.disabled">Materials:</Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>{s.inputs.map((inputId, i) => (<Chip key={i} label={`${s.inputQty?.[i] ?? 1}× ${getProductName(inputId)}`} size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />))}</Box>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              {canMutate && (
                <CardActions sx={{ borderTop: "1px solid", borderColor: "#fde68a", px: 2, py: 1, justifyContent: "space-between" }}>
                  <Button size="small" onClick={() => openEdit(s)} startIcon={<EditIcon fontSize="small" />} sx={{ color: "text.secondary" }}>Edit</Button>
                  <Button size="small" LinkComponent={Link} to={`/dashboard/schematics/${s.id}`} startIcon={<Article fontSize="small" />} sx={{ color: "text.secondary", fontWeight: 600 }}>View</Button>
                  <Button
                    size="small"
                    onClick={() => handleProduce(s.id, s.warehouseIds?.[0] || "")}
                    startIcon={<FactoryIcon fontSize="small" />}
                    sx={{ color: "success.main", fontWeight: 600 }}
                    disabled={!s.warehouseIds?.length || produceFetcher.state !== "idle"}
                  >
                    {produceFetcher.state !== "idle" ? "Producing..." : "Produce"}
                  </Button>
                </CardActions>
              )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editId ? "Edit Schematic" : "New Schematic"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField name="name" label="Schematic Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required fullWidth />
              <TextField name="type" label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required fullWidth />
              <TextField name="duration" label="Duration (seconds)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required fullWidth />
              <TextField name="outputQty" label="Output Quantity" type="number" value={form.outputQty} onChange={(e) => setForm({ ...form, outputQty: e.target.value })} required fullWidth />
            </Box>
            <FormControl fullWidth required>
              <InputLabel>Output Product</InputLabel>
              <Select name="outputItemId" label="Output Product" value={form.outputItemId} onChange={(e) => setForm({ ...form, outputItemId: e.target.value })}>
                <MenuItem value="">Select output product...</MenuItem>
                {outputProductOptions.map((p) => (<MenuItem key={p.id} value={p.id}>{p.name} ({p.sku})</MenuItem>))}
              </Select>
            </FormControl>
            <FormControlLabel control={<Checkbox name="active" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />} label="Active" />
            <FormControl fullWidth>
              <InputLabel>Warehouses</InputLabel>
              <Select multiple value={selectedWarehouseIds} onChange={(e) => setSelectedWarehouseIds(e.target.value as string[])} renderValue={(selected) => (selected as string[]).map((id) => warehouseOptions.find((w) => w.id === id)?.name ?? id).join(", ")}>
                {warehouseOptions.map((w) => (<MenuItem key={w.id} value={w.id}>{w.name} ({w.code})</MenuItem>))}
              </Select>
            </FormControl>
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Input Materials</Typography>
                <Button size="small" onClick={addMaterialRow} startIcon={<AddIcon />}>Add Material</Button>
              </Box>
              {materialInputs.map((mat, idx) => (
                <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
                  <Autocomplete size="small" options={productOptions} getOptionLabel={(opt) => `${opt.name} (${opt.sku})`} value={productOptions.find((p) => p.id === mat.productId) || null} onChange={(_, val) => updateMaterial(idx, "productId", val?.id || "")} sx={{ flex: 2 }} renderInput={(params) => <TextField {...params} label="Material" />} />
                  <TextField size="small" label="Qty" type="number" value={mat.quantity} onChange={(e) => updateMaterial(idx, "quantity", Number(e.target.value))} sx={{ flex: 0.5 }} slotProps={{ htmlInput: { min: 1 } }} />
                  {materialInputs.length > 1 && <Button size="small" color="error" onClick={() => removeMaterialRow(idx)}>✕</Button>}
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions><Button variant="outlined" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" variant="contained">{editId ? "Update" : "Create"}</Button></DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
