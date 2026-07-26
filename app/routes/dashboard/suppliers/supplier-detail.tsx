import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { Link } from "react-router";
import type { Route } from "../+types/supplier-detail";
import type { Supplier } from "~/types";
import { Box, Paper, Typography, Button, Divider, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: Supplier }>(`/supplier/${params.id}`, token, cookie);
  return { supplier: response.data };
}

export default function SupplierDetail({ loaderData }: Route.ComponentProps) {
  const supplier = loaderData?.supplier;
  if (!supplier) return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Supplier not found.</Typography></Paper>;

  return (
    <Box>
      <Button component={Link} to="/dashboard/suppliers" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Suppliers</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Supplier Detail</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Supplier ID</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{supplier.id}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Code</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{supplier.code}</Typography></Grid></Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{supplier.name}</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}><Grid size={6}><Typography variant="caption" color="text.secondary">Contact Person</Typography><Typography>{supplier.contactPerson || "—"}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Email</Typography><Typography>{supplier.email || "—"}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Phone</Typography><Typography>{supplier.phone || "—"}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Address</Typography><Typography>{supplier.address || "—"}</Typography></Grid></Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Created</Typography><Typography variant="body2">{new Date(supplier.createdAt).toLocaleString()}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Updated</Typography><Typography variant="body2">{new Date(supplier.updatedAt).toLocaleString()}</Typography></Grid></Grid>
      </Paper>
    </Box>
  );
}
