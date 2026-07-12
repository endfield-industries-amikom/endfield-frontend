import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import type { Route } from "./+types/dashboard-index";
import { Box, Paper, Typography, Grid } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import PublicIcon from "@mui/icons-material/Public";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  try {
    const [salesOrders, inventory, regions, products] = await Promise.all([
      get<{ data: { data: unknown[]; total: number } }>(`/sales-order?page=1&limit=100`, token, cookie),
      get<{ data: { data: unknown[]; total: number } }>(`/inventory?page=1&limit=100`, token, cookie),
      get<{ data: { data: unknown[]; total: number } }>(`/region?page=1&limit=100`, token, cookie),
      get<{ data: { data: unknown[]; total: number } }>(`/product?page=1&limit=100`, token, cookie),
    ]);
    const pendingOrders = (salesOrders.data.data as any[]).filter((o: any) => o.status === 'PENDING').length;
    return {
      pendingOrders,
      totalInventory: inventory.data.total,
      totalRegions: regions.data.total,
      totalProducts: products.data.total,
    };
  } catch {
    return { pendingOrders: 0, totalInventory: 0, totalRegions: 0, totalProducts: 0 };
  }
}

const statCards = [
  { label: "Pending Orders", key: "pendingOrders", icon: <ShoppingCartIcon />, color: "warning" },
  { label: "Inventory Items", key: "totalInventory", icon: <InventoryIcon />, color: "info" },
  { label: "Regions", key: "totalRegions", icon: <PublicIcon />, color: "success" },
  { label: "Products", key: "totalProducts", icon: <CategoryIcon />, color: "secondary" },
] as const;

export default function DashboardIndex({ loaderData }: Route.ComponentProps) {
  const stats = loaderData ?? { pendingOrders: 0, totalInventory: 0, totalRegions: 0, totalProducts: 0 };

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {statCards.map((card) => (
          <Grid key={card.key} size={{ xs: 6, md: 3 }}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: `${card.color}.light`,
                color: `${card.color}.dark`,
              }}
            >
              <Box sx={{ opacity: 0.6 }}>{card.icon}</Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats[card.key]}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
          Quick Overview
        </Typography>
        <Typography color="text.secondary">
          Welcome to the Endfield ERP dashboard. Use the sidebar to navigate between sections.
        </Typography>
      </Paper>
    </Box>
  );
}
