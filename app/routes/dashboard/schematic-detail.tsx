import { Link } from "react-router";
import type { Route } from "./+types/schematic-detail";
import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import type { ProductionSchematic, Item } from "~/types";
import { Box, Paper, Typography, Button, Divider, Grid, Chip, Card } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const [schematicRes, itemsRes] = await Promise.all([
    get<{ data: ProductionSchematic }>(`/production-schematic/${params.id}`, token, cookie),
    get<{ data: { data: Item[] } }>("/item?page=1&limit=200", token, cookie),
  ]);
  return { schematic: schematicRes.data, items: itemsRes.data.data };
}

export default function SchematicDetail({ loaderData }: Route.ComponentProps) {
  const s = loaderData?.schematic;
  const allItems = loaderData?.items ?? [];
  const itemMap = new Map(allItems.map((i) => [i.id, i]));

  function getItemName(id: string): string {
    const item = itemMap.get(id);
    return item ? `${item.name} (${item.sku})` : id;
  }

  if (!s) {
    return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Schematic not found.</Typography></Paper>;
  }

  return (
    <Box>
      <Button component={Link} to="/dashboard/schematics" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Schematics</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Schematic Detail</Typography>
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Schematic ID</Typography><Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{s.id}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Type</Typography><Chip label={s.type} size="small" variant="outlined" /></Grid></Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>{s.name}</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Duration</Typography><Typography variant="h5" sx={{ fontWeight: 600 }}>{s.duration} min</Typography></Grid>
          <Grid size={6}><Typography variant="caption" color="text.secondary">Output Qty</Typography><Typography variant="h5" sx={{ fontWeight: 600 }}>{s.outputQty}</Typography></Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="caption" color="text.secondary">Output Item</Typography>
        {s.outputItem ? (
          <Box sx={{ mt: 0.5 }}>
            <Typography sx={{ fontWeight: 600 }}>{s.outputItem.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace" }}>{s.outputItem.sku}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>{getItemName(s.outputItemId)}</Typography>
        )}
        {s.inputs && s.inputs.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Input Materials ({s.inputs.length})</Typography>
            <Grid container spacing={1}>
              {s.inputs.map((input, idx) => (
                <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                  <Card variant="outlined" sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "grey.50" }}>
                    <Typography variant="body2">{getItemName(input)}</Typography>
                    <Chip label={`Qty: ${s.inputQty?.[idx] ?? "—"}`} size="small" color="primary" variant="outlined" />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}><Grid size={6}><Typography variant="caption" color="text.secondary">Created</Typography><Typography variant="body2">{new Date(s.createdAt).toLocaleString()}</Typography></Grid><Grid size={6}><Typography variant="caption" color="text.secondary">Updated</Typography><Typography variant="body2">{new Date(s.updatedAt).toLocaleString()}</Typography></Grid></Grid>
      </Paper>
    </Box>
  );
}
