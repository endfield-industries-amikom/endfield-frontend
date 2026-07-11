import { useState, useRef } from "react";
import { Link, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/products";
import type { Product } from "~/services/types";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { get, post, patch } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";

function useRole() {
  const parent = useRouteLoaderData<{ accessToken: string }>("routes/dashboard/auth-guard");
  if (!parent?.accessToken) return "Consumer";
  try { return JSON.parse(atob(parent.accessToken.split(".")[1])).role; }
  catch { return "Consumer"; }
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: { data: Product[]; total: number; page: number; limit: number } }>(
    "/product?page=1&limit=50", token, cookie,
  );
  return { products: response.data.data };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const contentType = request.headers.get("Content-Type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    if (intent === "upload-image") {
      const id = formData.get("id") as string;
      const file = formData.get("file") as File;
      if (!file || !id) return { ok: false, error: "Missing file or id" };

      const uploadFd = new FormData();
      uploadFd.append("file", file);

      await fetch(`${process.env.API_GATEWAY_URL || ""}/product/${id}/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Cookie: cookie },
        body: uploadFd,
      });
      return { ok: true };
    }
  }

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create-product" || intent === "update-product") {
    const body: Record<string, unknown> = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      description: formData.get("description") || undefined,
      category: formData.get("category") || undefined,
      unitPrice: Number(formData.get("unitPrice")),
    };
    const capacityUsage = formData.get("capacityUsage") as string;
    if (capacityUsage) body.capacityUsage = Number(capacityUsage);
    const type = formData.get("type") as string;
    if (type) body.type = type;

    let id: string;
    if (intent === "create-product") {
      const res = await post<{ data: Product }>("/product", body, token, cookie);
      id = res.data.id;
    } else {
      id = formData.get("id") as string;
      await patch(`/product/${id}`, body, token, cookie);
    }
    return { ok: true, createdId: id };
  }

  if (intent === "delete-product") {
    await post(`/product/${formData.get("id")}/delete`, {}, token, cookie);
    return { ok: true };
  }

  return { ok: false, error: "Unknown intent" };
}

const emptyForm = { name: "", sku: "", description: "", category: "", unitPrice: "", capacityUsage: "", type: "product" };

export default function ProductsSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const products = loaderData?.products ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher();
  const deleteFetcher = useFetcher();
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
      name: p.name, sku: p.sku, description: p.description || "",
      category: p.category || "", unitPrice: String(p.unitPrice),
      capacityUsage: String(p.capacityUsage ?? ""),
      type: p.type || "product",
    });
    setImageFile(null);
    setImagePreview(p.imageUri || "");
    setDialogOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", editId ? "update-product" : "create-product");
    if (editId) fd.set("id", editId);
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  function getImageSrc(p: Product): string | undefined {
    if (!p.imageUri) return undefined;
    if (p.imageUri.startsWith("/api/")) return `${process.env.API_GATEWAY_URL || ""}${p.imageUri}`;
    return p.imageUri;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Products</Typography>
        {canMutate && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Product</Button>}
      </Box>
      {actionData?.error && <Typography color="error" sx={{ mb: 2 }}>{actionData.error}</Typography>}
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
              <TableRow key={p.id} hover>
                <TableCell>
                  {p.imageUri ? (
                    <Box component="img" src={getImageSrc(p)} alt={p.name}
                      sx={{ width: 40, height: 40, borderRadius: 1, objectFit: "cover" }} />
                  ) : (
                    <Box sx={{ width: 40, height: 40, bgcolor: "grey.200", borderRadius: 1 }} />
                  )}
                </TableCell>
                <TableCell><Link to={`/dashboard/products/${p.id}`} style={{ textDecoration: "none", fontWeight: 500, color: "inherit" }}>{p.name}</Link></TableCell>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{p.sku}</TableCell>
                <TableCell>{p.category || "—"}</TableCell>
                <TableCell>{p.capacityUsage ?? "—"}</TableCell>
                <TableCell>{p.unitPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell>
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
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField name="category" label="Category" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })} fullWidth />
              <TextField name="type" label="Type" value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })} fullWidth />
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField name="unitPrice" label="Unit Price" type="number" value={form.unitPrice}
                onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
                required fullWidth slotProps={{ htmlInput: { step: "0.01" } }} />
              <TextField name="capacityUsage" label="Capacity Usage" type="number" value={form.capacityUsage}
                onChange={(e) => setForm({ ...form, capacityUsage: e.target.value })}
                fullWidth slotProps={{ htmlInput: { step: "0.01", min: "0" } }} />
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
