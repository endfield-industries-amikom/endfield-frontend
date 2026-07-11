import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { Link } from "react-router";
import type { Route } from "./+types/customer-detail";
import type { Customer } from "~/services/types";
import { Box, Paper, Typography, Button, Divider, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: Customer }>(`/customers/${params.id}`, token, cookie);
  return { customer: response.data };
}

export default function CustomerDetail({ loaderData }: Route.ComponentProps) {
  const customer = loaderData?.customer;
  if (!customer) return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Customer not found.</Typography></Paper>;

  return (
    <Box>
      <Button component={Link} to="/dashboard/customers" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Customers</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Customer Detail</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Customer ID</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{customer.id}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Code</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{customer.code}</Typography></Grid></Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{customer.name}</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}><Grid size={6}><Typography variant="caption" color="text.secondary">Email</Typography><Typography>{customer.email || "—"}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Phone</Typography><Typography>{customer.phone || "—"}</Typography></Grid></Grid>
        {customer.address && <><Divider sx={{ my: 2 }} /><Typography variant="caption" color="text.secondary">Address</Typography><Typography>{customer.address}</Typography></>}
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Created</Typography><Typography variant="body2">{new Date(customer.createdAt).toLocaleString()}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Updated</Typography><Typography variant="body2">{new Date(customer.updatedAt).toLocaleString()}</Typography></Grid></Grid>
      </Paper>
    </Box>
  );
}
