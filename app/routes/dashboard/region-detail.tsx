import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { Link } from "react-router";
import type { Route } from "./+types/region-detail";
import type { Region } from "~/services/types";
import { Box, Paper, Typography, Button, Divider, Grid, Card, CardActionArea } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface RegionWithWarehouses extends Region { warehouses?: { id: string; name: string; code: string }[]; }

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: RegionWithWarehouses }>(`/region/${params.id}`, token, cookie);
  return { region: response.data };
}

export default function RegionDetail({ loaderData }: Route.ComponentProps) {
  const region = loaderData?.region;
  if (!region) return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Region not found.</Typography></Paper>;

  return (
    <Box>
      <Button component={Link} to="/dashboard/regions" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Regions</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Region Detail</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Region ID</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{region.id}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Code</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{region.code}</Typography></Grid></Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{region.name}</Typography>
        {region.description && <><Divider sx={{ my: 2 }} /><Typography variant="caption" color="text.secondary">Description</Typography><Typography>{region.description}</Typography></>}
        {region.warehouses && region.warehouses.length > 0 && <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Warehouses ({region.warehouses.length})</Typography>
          <Grid container spacing={1}>
            {region.warehouses.map((w) => (
              <Grid key={w.id} size={{ xs: 12, sm: 6 }}>
                <Card variant="outlined" sx={{ bgcolor: "grey.50" }}>
                  <CardActionArea component={Link} to={`/dashboard/warehouses/${w.id}`} sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{w.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>{w.code}</Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>}
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Created</Typography><Typography variant="body2">{new Date(region.createdAt).toLocaleString()}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Updated</Typography><Typography variant="body2">{new Date(region.updatedAt).toLocaleString()}</Typography></Grid></Grid>
      </Paper>
    </Box>
  );
}
