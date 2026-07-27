import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import { Link } from "react-router";
import type { Route } from "./+types/warehouse-detail";
import type { Warehouse, Inventory } from "~/types";
import {
  Box, Paper, Typography, Button, Divider, Grid, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);

  const [whRes, invRes] = await Promise.all([
    get<{ data: Warehouse }>(`/warehouses/${params.id}`, token, cookie),
    get<{ data: Inventory[] }>(`/warehouses/${params.id}/inventory`, token, cookie),
  ]);

  return {
    warehouse: whRes.data,
    inventory: invRes.data ?? [],
  };
}

export default function WarehouseDetail({ loaderData }: Route.ComponentProps) {
  const warehouse = loaderData?.warehouse;
  const inventory: Inventory[] = loaderData?.inventory ?? [];

  if (!warehouse) {
    return (
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary">Warehouse not found.</Typography>
      </Paper>
    );
  }

  const maxCap = warehouse.maxCapacity ?? 0;
  const currentCap = warehouse.currentLoad ?? 0;
  const capacityPct = maxCap > 0 ? Math.min(100, (currentCap / maxCap) * 100) : 0;
  const totalOnHand = inventory.reduce((sum, inv) => sum + inv.quantityOnHand, 0);

  return (
    <Box>
      <Button component={Link} to="/dashboard/warehouses" startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, color: "text.secondary" }}>
        Back to Warehouses
      </Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Warehouse Detail</Typography>

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Warehouse ID</Typography>
            <Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{warehouse.id}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Code</Typography>
            <Typography sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{warehouse.code}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h6" sx={{ fontWeight: 600 }}>{warehouse.name}</Typography>
        <Typography variant="body2" color="text.secondary">{warehouse.address || "—"}</Typography>
        <Typography variant="body2" color="text.secondary">
          Region: {warehouse.region?.name ?? "—"}
        </Typography>

        {maxCap > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary">Capacity Usage</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress variant="determinate" value={capacityPct}
                  color={capacityPct > 90 ? "error" : capacityPct > 70 ? "warning" : "primary"}
                  sx={{ height: 10, borderRadius: 5 }} />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {currentCap} / {maxCap}
              </Typography>
            </Box>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Inventory ({inventory.length} records · {totalOnHand} total items)
        </Typography>

        {inventory.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No inventory records for this warehouse.
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">On Hand</TableCell>
                  <TableCell align="right">Reserved</TableCell>
                  <TableCell align="right">Available</TableCell>
                  <TableCell align="right">Reorder Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((inv) => (
                  <TableRow key={inv.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {inv.item?.name ?? inv.itemId}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                      {inv.item?.sku ?? "—"}
                    </TableCell>
                    <TableCell align="right">{inv.quantityOnHand}</TableCell>
                    <TableCell align="right">{inv.reservedQuantity}</TableCell>
                    <TableCell align="right">{inv.quantityOnHand - inv.reservedQuantity}</TableCell>
                    <TableCell align="right">{inv.reorderLevel}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Created</Typography>
            <Typography variant="body2">{new Date(warehouse.createdAt).toLocaleString()}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="caption" color="text.secondary">Updated</Typography>
            <Typography variant="body2">{new Date(warehouse.updatedAt).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
