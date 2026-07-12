import { useState, useEffect } from "react";
import { Outlet, NavLink, useFetcher, useRouteLoaderData } from "react-router";
import { Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton, ListItemText, ListItemIcon, Button, Chip, IconButton, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { getMenu } from "./menu-items";

const DRAWER_WIDTH = 260;

function parseJwt(token: string): { sub: string; email: string; role: string } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch { return null; }
}

export default function DashboardLayout() {
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("Consumer");
  const [mobileOpen, setMobileOpen] = useState(false);
  const logoutFetcher = useFetcher();
  const isLoggingOut = logoutFetcher.state !== "idle";

  const parentData = useRouteLoaderData<{ accessToken: string }>("routes/dashboard/auth-guard");
  const accessToken = parentData?.accessToken || "";

  useEffect(() => {
    if (accessToken) {
      const payload = parseJwt(accessToken);
      if (payload) {
        setUserEmail(payload.email);
        setUserRole(payload.role);
      }
    }
  }, [accessToken]);

  const menu = getMenu(userRole);

  const roleColor: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
    Admin: "error", Employee: "primary", Consumer: "default",
  };

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }} color="primary.main">Endfield ERP</Typography>
          <Typography variant="caption" color="text.secondary">Logistics Intelligence Platform</Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, px: 1 }}>
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <ListItemButton key={item.id} component={NavLink} to={item.path} onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: 2, mb: 0.5, "&.active": { bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 600, "&:hover": { bgcolor: "primary.main" } } }}>
              <ListItemIcon sx={{ minWidth: 36 }}><Icon fontSize="small" /></ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <logoutFetcher.Form method="post" action="/dashboard/auth/login">
          <input type="hidden" name="intent" value="logout" />
          <Button type="submit" disabled={isLoggingOut} fullWidth variant="outlined" color="inherit" startIcon={<LogoutIcon />} size="small">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </logoutFetcher.Form>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" color="default" elevation={1} sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` } }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: "none" } }}><MenuIcon /></IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>Endfield ERP Dashboard</Typography>
          {userEmail && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="text.secondary">{userEmail}</Typography>
              <Chip label={userRole} size="small" color={roleColor[userRole] || "default"} />
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH } }}>{drawer}</Drawer>
      <Drawer variant="permanent"
        sx={{ display: { xs: "none", md: "block" }, width: DRAWER_WIDTH, flexShrink: 0, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }} open>{drawer}</Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}><Outlet /></Box>
      </Box>
    </Box>
  );
}
