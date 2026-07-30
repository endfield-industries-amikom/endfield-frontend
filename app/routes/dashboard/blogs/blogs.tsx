import { Suspense, useEffect, useRef, useState } from "react";
import { Await, useNavigate, useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/blogs";
import type { IBlog } from "~/types";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton, Snackbar, Alert,
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
import { parseJwt } from "~/utils/parsejwt";

function useRole() {
  const parent = useRouteLoaderData<{ accessToken: string }>("routes/dashboard/auth-guard");
  if (!parent?.accessToken) return "Consumer";
  try { return JSON.parse(atob(parent.accessToken.split(".")[1])).role; }
  catch { return "Consumer"; }
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const blogsPromise = get<{ data: { data: IBlog[]; total: number; page: number; limit: number } }>(
    "/blog?page=1&limit=50", token, cookie,
  ).then((r) => r.data.data);
  return { blogs: blogsPromise };
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);

  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
    if (intent === "create-blog") {
      const body: Record<string, unknown> = {
        title: formData.get("title"),
        content: formData.get("content"),
        author: formData.get("author")
      };

      const res = await post<{ data: IBlog }>("/blog", body, token, cookie);
      const blogId = res.data.id;

      const file = formData.get("imageFile") as File | null;
      if (file && file.size > 0) {
        const uploadFd = new FormData();
        uploadFd.append("file", file);
        await apiRequest(`/blogs/${blogId}/image`, { method: "POST", body: uploadFd, isMultipart: true, token, cookie });
      }

      return { ok: true, intent };
    }

    if (intent === "update-blog") {
      const id = formData.get("id") as string;
      const body: Record<string, unknown> = {
        title: formData.get("title"),
        content: formData.get("content"),
      };

      await patch(`/blog/${id}`, body, token, cookie);

      const file = formData.get("imageFile") as File | null;
      if (file && file.size > 0) {
        const uploadFd = new FormData();
        uploadFd.append("file", file);
        await apiRequest(`/blogs/${id}/image`, { method: "POST", body: uploadFd, isMultipart: true, token, cookie });
      }

      return { ok: true, intent };
    }

    if (intent === "delete-blog") {
      await del(`/blog/${formData.get("id")}`, token, cookie);
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

const emptyForm = { title: "", content: "" };

export default function BlogsSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const parentData = useRouteLoaderData<{ accessToken: string }>("routes/dashboard/auth-guard");
  const [username, setUsername] = useState<string>("");
  const token = parentData?.accessToken || "";
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
    if (token) {
      const parsed = parseJwt(token);
      if (parsed) setUsername(parsed.username);
    }
  }, [token])

  useEffect(() => {
    if (fetcher.state === "submitting") setActionError(null);
  }, [fetcher.state]);

  useEffect(() => {
    if (deleteFetcher.state === "submitting") setDeleteError(null);
  }, [deleteFetcher.state]);

  useEffect(() => {
    if (prevFetcherState.current === "loading" && fetcher.state === "idle") {
      const data = fetcher.data as { ok?: boolean; intent?: string; error?: string; errorRaw?: Error } | undefined;
      if (data?.ok) {
        const messages: Record<string, string> = {
          "create-blog": "Blog created successfully.",
          "update-blog": "Blog updated successfully.",
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
        setSuccessMsg("Blog deleted successfully.");
        setDeleteError(null);
      } else if (data?.ok === false) {
        setDeleteError(data);
      }
    }
    prevDeleteState.current = deleteFetcher.state;
  }, [deleteFetcher.state, deleteFetcher.data]);

  const canMutate = role === "Admin" || role === "Editor";

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setDialogOpen(true);
  }

  function openEdit(b: IBlog) {
    setEditId(b.id);
    setForm({ title: b.title, content: b.content });
    setImageFile(null);
    setImagePreview(b.imageUri || "");
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
    fd.set("intent", editId ? "update-blog" : "create-blog");
    if (editId) fd.set("id", editId);
    if (imageFile) fd.set("imageFile", imageFile);
    fd.set("author", username);
    fetcher.submit(fd, { method: "post", encType: "multipart/form-data" });
    setDialogOpen(false);
  }

  function getImageSrc(b: IBlog): string | undefined {
    return normalizeImageUrl(b.imageUri);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Blogs</Typography>
        {canMutate && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Blog</Button>}
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
      <Suspense fallback={<SkeletonTable columns={canMutate ? 5 : 4} />}>
        <Await resolve={(loaderData as any).blogs}>
          {(blogs: IBlog[]) => (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Updated</TableCell>
                    {canMutate && <TableCell align="right">Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blogs.length === 0 && (
                    <TableRow><TableCell colSpan={canMutate ? 5 : 4} align="center">
                      <Typography color="text.secondary" sx={{ py: 2 }}>No blogs found.</Typography>
                    </TableCell></TableRow>
                  )}
                  {blogs.map((b) => (
                    <TableRow key={b.id} hover sx={{ cursor: "pointer" }} onClick={(e) => {
                                     if ((e.target as HTMLElement).closest("button,a,input,textarea,select")) return;
                                     navigate(`/dashboard/blogs/${b.id}`);
                                   }}>
                      <TableCell>
                        {b.imageUri ? (
                          <Box component="img" src={getImageSrc(b)} alt={b.title}
                            sx={{ width: 40, height: 40, borderRadius: 1, objectFit: "cover" }} />
                        ) : (
                          <Box sx={{ width: 40, height: 40, bgcolor: "grey.200", borderRadius: 1 }} />
                        )}
                      </TableCell>
                      <TableCell>{b.title}</TableCell>
                      <TableCell>{b.author || "—"}</TableCell>
                      <TableCell>{b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : "—"}</TableCell>
                      {canMutate && (
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => openEdit(b)}><EditIcon fontSize="small" /></IconButton>
                          <deleteFetcher.Form method="post" style={{ display: "inline" }}>
                            <input type="hidden" name="intent" value="delete-blog" />
                            <input type="hidden" name="id" value={b.id} />
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
          <DialogTitle>{editId ? "Edit Blog" : "New Blog"}</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <TextField name="title" label="Title" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} required fullWidth />
            <TextField name="content" label="Content" value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              required fullWidth multiline rows={6} />

            {/* Image upload */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>Cover Image (optional)</Typography>
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
                <Box component="img" src={imagePreview.startsWith("blob:") ? imagePreview : normalizeImageUrl(imagePreview)} alt="Preview"
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
