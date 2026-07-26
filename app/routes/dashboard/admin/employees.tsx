import { del, get, post } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { useState } from "react";
import { useFetcher, useRouteLoaderData } from "react-router";
import type { Route } from "./+types/employees";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, IconButton, MenuItem, Chip, Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface AdminUser {
  id: string; username: string; email: string; role: string; createdAt: string; updatedAt: string;
}

function useRole() {
  const parent = useRouteLoaderData<{ accessToken: string }>("routes/dashboard/auth-guard");
  if (!parent?.accessToken) return "Consumer";
  try { return JSON.parse(atob(parent.accessToken.split(".")[1])).role; }
  catch { return "Consumer"; }
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  try {
    const response = await get<{ data: { data: AdminUser[]; total: number; page: number; limit: number } }>(
      "/admin/users?page=1&limit=50", token, cookie,
    );
    return { users: response.data.data };
  } catch {
    return { users: [], error: "Failed to load users." as const };
  }
}

export async function action({ request }: Route.ActionArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create-user") {
    await post("/admin/users", { username: formData.get("username"), email: formData.get("email"), password: formData.get("password"), roleName: formData.get("roleName") }, token, cookie);
    return { ok: true };
  }
  if (intent === "delete-user") {
    await del(`/admin/users/${formData.get("id")}`, token, cookie);
    return { ok: true };
  }
  return { ok: false, error: "Unknown intent" };
}

function roleBadgeColor(role: string) { const m: Record<string, "secondary" | "primary" | "default"> = { Admin: "secondary", Employee: "primary", Consumer: "default" }; return m[role] || "default"; }

export default function EmployeesSection({ loaderData, actionData }: Route.ComponentProps) {
  const role = useRole();
  const users = (loaderData?.users as AdminUser[]) ?? [];
  const loadError = (loaderData as any)?.error as string | undefined;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", roleName: "Employee" });
  const [testCrash, setTestCrash] = useState(false);
  const fetcher = useFetcher();
  const isAdmin = role === "Admin";

  if (testCrash) {
    throw new Error("This is a test crash — the ErrorFallback component should render now.");
  }

  function openCreate() { setForm({ username: "", email: "", password: "", roleName: "Employee" }); setDialogOpen(true); }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    fd.set("intent", "create-user");
    fetcher.submit(fd, { method: "post" });
    setDialogOpen(false);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Employees</Typography>
        {isAdmin && <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>New Employee</Button>}
        <Button variant="outlined" color="error" size="small" onClick={() => setTestCrash(true)} sx={{ ml: 1 }}>
          Test Error Boundary
        </Button>
      </Box>

      {!isAdmin && <Alert severity="warning" sx={{ mb: 2 }}>Only Admin users can manage employee accounts.</Alert>}
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      {actionData?.error && <Typography color="error" sx={{ mb: 2 }}>{actionData.error}</Typography>}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell>
              <TableCell>Created</TableCell>{isAdmin && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 && (
              <TableRow><TableCell colSpan={isAdmin ? 5 : 4} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>{loadError ? "Could not load users." : "No users found."}</Typography>
              </TableCell></TableRow>
            )}
            {users.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell><Chip label={u.role} size="small" color={roleBadgeColor(u.role)} /></TableCell>
                <TableCell sx={{ color: "text.secondary", fontSize: "0.8rem" }}>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                {isAdmin && (
                  <TableCell align="right">
                    <fetcher.Form method="post" style={{ display: "inline" }}>
                      <input type="hidden" name="intent" value="delete-user" />
                      <input type="hidden" name="id" value={u.id} />
                      <IconButton size="small" type="submit" color="error"
                        onClick={(e) => { if (!confirm(`Delete user "${u.username}"?`)) e.preventDefault(); }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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
          <DialogTitle>New Employee</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "8px !important" }}>
            <TextField name="username" label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required fullWidth />
            <TextField name="email" label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required fullWidth />
            <TextField name="password" label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required fullWidth helperText="Minimum 8 characters" />
            <TextField name="roleName" label="Role" select value={form.roleName} onChange={(e) => setForm({ ...form, roleName: e.target.value })} required fullWidth>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Worker">Editor</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create User</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
