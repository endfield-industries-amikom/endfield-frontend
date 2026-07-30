import { Suspense, useEffect, useRef, useState } from "react";
import { Await, useNavigate, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/products";
import type { Product } from "~/types";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton, Checkbox, FormControlLabel, Snackbar, Alert,
} from "@mui/material";
import ErrorPopup from "~/components/error";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { get, post, patch, del, apiRequest } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { normalizeImageUrl } from "~/utils/image";
import SkeletonTable from "~/components/SkeletonTable";

function useRole() {
  const parent = useRouteLoaderData<{ accessToken: string }>("routes/dashboard/auth-guard");
  if (!parent?.accessToken) return "Consumer";
  try { return JSON.parse(atob(parent.accessToken.split(".")[1])).role; }
  catch { return "Consumer"; }
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const productsPromise = get<{ data: { data: Product[]; total: number; page: number; limit: number } }>(
    "/product?page=1&limit=50", token, cookie,
  ).then((r) => r.data.data);
  return { products: productsPromise };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);

  // Always parse as multipart — text fields + optional file
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
  if (intent === "create-product") {
    const body: Record<string, unknown> = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      description: formData.get("description") || undefined,
      category: formData.get("category") || undefined,
      unitPrice: Number(formData.get("unitPrice")),
      type: "product",
      isSellable: formData.get("isSellable") === "on",
      isManufactureable: formData.get("isManufactureable") === "on",
    };
    const capacityUsage = formData.get("capacityUsage") as string;
    if (capacityUsage) body.capacityUsage = Number(capacityUsage);

    // Step 1: create product
    const res = await post<{ data: Product }>("/product", body, token, cookie);
    const productId = res.data.id;

    // Step 2: upload image if file provided — id is shared PK with Item
    const file = formData.get("imageFile") as File | null;
    if (file && file.size > 0) {
      const uploadFd = new FormData();
      uploadFd.append("file", file);
      await apiRequest(`/product/${productId}/image`, { method: "POST", body: uploadFd, isMultipart: true, token, cookie });
    }

    return { ok: true, intent };
  }

  if (intent === "update-product") {
    const id = formData.get("id") as string;
    const body: Record<string, unknown> = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      description: formData.get("description") || undefined,
      category: formData.get("category") || undefined,
      unitPrice: Number(formData.get("unitPrice")),
      type: "product",
      isSellable: formData.get("isSellable") === "on",
      isManufactureable: formData.get("isManufactureable") === "on",
    };
    const capacityUsage = formData.get("capacityUsage") as string;
    if (capacityUsage) body.capacityUsage = Number(capacityUsage);

    await patch(`/product/${id}`, body, token, cookie);

    // Upload image if file provided — id is shared PK with Item
    const file = formData.get("imageFile") as File | null;
    if (file && file.size > 0) {
      const uploadFd = new FormData();
      uploadFd.append("file", file);
      await apiRequest(`/product/${id}/image`, { method: "POST", body: uploadFd, isMultipart: true, token, cookie });
    }

    return { ok: true, intent };
  }

  if (intent === "delete-product") {
    await del(`/product/${formData.get("id")}`, token, cookie);
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

const emptyForm = { name: "", sku: "", description: "", category: "", unitPrice: "", capacityUsage: "", isSellable: true, isManufactureable: true };

export default function ProductsSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [actionError, setActionError] = useState<{ error?: string; errorRaw?: Error } | null>(null);
  const deleteFetcher = useFetcher();
  const [deleteError, setDeleteError] = useState<{ error?: string; errorRaw?: Error } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const prevFetcherState = useRef(fetcher.state);
  const prevDeleteState = useRef(deleteFetcher.state);

  useEffect(() => {
    if (prevFetcherState.current === "loading" && fetcher.state === "idle") {
      const data = fetcher.data as { ok?: boolean; intent?: string; error?: string; errorRaw?: Error } | undefined;
      if (data?.ok) {
        const messages: Record<string, string> = {
          "create-product": "Product created successfully.",
          "update-product": "Product updated successfully.",
        };
        setSuccessMsg(messages[data.intent as string] || "Operation completed.");
        setActionError(null);
      } else if (data?.ok === false) {
        setActionError(data);
      }
    }
    prevFetcherState.current = fetcher.state;
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    if (prevDeleteState.current === "loading" && deleteFetcher.state === "idle") {
      const data = deleteFetcher.data as { ok?: boolean; error?: string; errorRaw?: Error } | undefined;
      if (data?.ok) {
        setSuccessMsg("Product deleted successfully.");
        setDeleteError(null);
      } else if (data?.ok === false) {
        setDeleteError(data);
      }
    }
    prevDeleteState.current = deleteFetcher.state;
  }, [deleteFetcher.state, deleteFetcher.data]);
  const canMutate = role === "Admin" || role === "Employee";

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setDialogOpen(true);
  }

  function openEdit(p: Product) {
      setEditId(p.id);
      setForm({
        name: p.item?.name || "", sku: p.item?.sku || "", description: p.item?.description || "",
        category: p.item?.category || "", unitPrice: String(p.item?.unitPrice || ""),
        capacityUsage: String(p.item?.capacityUsage ?? ""),
                isSellable: p.item?.isSellable ?? true,
        isManufactureable: p.item?.isManufactureable ?? true,
      });
      setImageFile(null);
      setImagePreview(p.item?.imageUri || "");
    setDialogOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-product" : "create-product");
    if (editId) fd.set("id", editId);
    // Append image file if selected
    if (imageFile) fd.set("imageFile", imageFile);
    fetcher.submit(fd, { method: "post", encType: "multipart/form-data" });
    setDialogOpen(false);
  }

  function getImageSrc(p: Product): string | undefined {
      return normalizeImageUrl(p.item?.imageUri);
    }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Products</Typography>
        {canMutate && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Product</Button>}
      </Box>
      {actionError && (
        <ErrorPopup
          message={actionError.error as string}
          error={(actionError as any).errorRaw}
        />
      )}
      {deleteError && (
        <ErrorPopup
          message={deleteError.error as string}
          error={(deleteError as any).errorRaw}
        />
      )}
      <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSuccessMsg(null)} severity="success" variant="filled" sx={{ width: "100%" }}>
          {successMsg}
        </Alert>
      </Snackbar>
      <Suspense fallback={<SkeletonTable columns={canMutate ? 7 : 6} />}>
        <Await resolve={(loaderData as any).products}>
          {(products: Product[]) => (
            <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell><TableCell>Name</TableCell><TableCell>SKU</TableCell>
              <TableCell>Category</TableCell><TableCell>Capacity</TableCell><TableCell>Price</TableCell>
              {canMutate && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 && (
              <TableRow><TableCell colSpan={canMutate ? 7 : 6} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>No products found.</Typography>
              </TableCell></TableRow>
            )}
            {products.map((p) => (
              <TableRow key={p.id} hover sx={{cursor: "pointer"}} onClick={(e) => {
                               if ((e.target as HTMLElement).closest("button,a,input,textarea,select")) return;
                               navigate(`/dashboard/products/${p.id}`);
                             }}>
                <TableCell>
                  {p.item?.imageUri ? (
                    <Box component="img" src={getImageSrc(p)} alt={p.item?.name}
                      sx={{ width: 40, height: 40, borderRadius: 1, objectFit: "cover" }} />
                  ) : (
                    <Box sx={{ width: 40, height: 40, bgcolor: "grey.200", borderRadius: 1 }} />
                  )}
                </TableCell>
                <TableCell>{p.item?.name}</TableCell>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{p.item?.sku}</TableCell>
                <TableCell>{p.item?.category || "—"}</TableCell>
                <TableCell>{p.item?.capacityUsage ?? "—"}</TableCell>
                <TableCell>{(Number(p.item?.unitPrice) || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell>
                {canMutate && (
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(p)}><EditIcon fontSize="small" /></IconButton>
                    <deleteFetcher.Form method="post" style={{ display: "inline" }}>
                      <input type="hidden" name="intent" value="delete-product" />
                      <input type="hidden" name="id" value={p.id} />
                      <IconButton size="small" type="submit" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </deleteFetcher.Form>
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
          <DialogTitle>{editId ? "Edit Product" : "New Product"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <TextField name="name" label="Product Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required fullWidth />
            <TextField name="sku" label="SKU" value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })} required fullWidth />
            <TextField name="description" label="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={2} />
            <TextField name="category" label="Category" value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField name="unitPrice" label="Unit Price" type="number" value={form.unitPrice}
                onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                required fullWidth slotProps={{ htmlInput: { step: "0.01" } }} />
              <TextField name="capacityUsage" label="Capacity Usage" type="number" value={form.capacityUsage}
                onChange={(e) => setForm({ ...form, capacityUsage: e.target.value })}
                fullWidth slotProps={{ htmlInput: { step: "0.01", min: "0" } }} />
                            </Box>

                            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControlLabel
                control={<Checkbox name="isSellable" checked={form.isSellable}
                  onChange={(e) => setForm({ ...form, isSellable: e.target.checked })} />}
                label="Sellable" />
              <FormControlLabel
                control={<Checkbox name="isManufactureable" checked={form.isManufactureable}
                  onChange={(e) => setForm({ ...form, isManufactureable: e.target.checked })} />}
                label="Manufacturable" />
                            </Box>

                            {/* Image upload */}
                            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Product Image (optional)</Typography>
              <input type="file" accept="image/*" ref={fileInputRef}
                onChange={handleFileChange} style={{ display: "none" }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button variant="outlined" startIcon={<CloudUploadIcon />}
                  onClick={() => fileInputRef.current?.click()}>
                  {imageFile ? imageFile.name : "Choose File"}
                </Button>
                {imageFile && (
                  <Button size="small" color="error" onClick={() => { setImageFile(null); setImagePreview(""); }}>
                    Remove
                  </Button>
                )}
              </Box>
              {imagePreview && (
                <Box component="img" src={imagePreview} alt="Preview"
                  sx={{ mt: 1, width: "100%", maxHeight: 160, objectFit: "contain", borderRadius: 1, bgcolor: "grey.100" }} />
              )}
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
