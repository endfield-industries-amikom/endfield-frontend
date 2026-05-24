"use client";

import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { BRAND, NAV_ITEMS } from "./navigation";

const logoFilter =
  "brightness(0) saturate(100%) invert(13%) sepia(8%) hue-rotate(208deg) contrast(95%)";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActivePath = useMemo(() => {
    return (to: string) => {
      if (to === "/") return location.pathname === "/";
      return location.pathname === to || location.pathname.startsWith(`${to}/`);
    };
  }, [location.pathname]);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{ bgcolor: "#FAFAFA", color: "#202020" }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 56, sm: 64 },
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box
              component={NavLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                textDecoration: "none",
                color: "inherit",
                fontWeight: 700,
                letterSpacing: 1.2,
              }}
            >
              <Box
                component="img"
                src={BRAND.logoUrl}
                alt="Endfield Industries logo"
                sx={{
                  height: 36,
                  width: "auto",
                  filter: logoFilter,
                  transition: "filter 250ms ease",
                }}
              />
              <Typography
                component="span"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.95rem", sm: "1rem", md: "1.05rem" },
                }}
              >
                {BRAND.name}
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
              }}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = isActivePath(item.to);
                return (
                  <Button
                    key={item.to}
                    component={NavLink}
                    to={item.to}
                    sx={{
                      color: "inherit",
                      textTransform: "none",
                      fontWeight: isActive ? 700 : 500,
                      "&:hover": { color: "#e0d31a" },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            <IconButton
              aria-label="Open navigation menu"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            bgcolor: "#FAFAFA",
            color: "#202020",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 3 }}>
            <Box
              component={NavLink}
              to="/"
              sx={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
              onClick={handleDrawerToggle}
            >
              <Box
                component="img"
                src={BRAND.logoUrl}
                alt="Endfield Industries logo"
                sx={{ height: 32, width: "auto", filter: logoFilter }}
              />
              <Typography sx={{ fontWeight: 700 }}>{BRAND.name}</Typography>
            </Box>
          </Box>
          <Divider />
          <List sx={{ px: 1 }}>
            {NAV_ITEMS.map((item) => (
              <ListItemButton
                key={item.to}
                component={NavLink}
                to={item.to}
                selected={isActivePath(item.to)}
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 1,
                  "&.Mui-selected": {
                    bgcolor: "rgba(224, 211, 26, 0.2)",
                    fontWeight: 700,
                  },
                  "&:hover": { bgcolor: "rgba(224, 211, 26, 0.15)" },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ px: 3, mt: "auto", pb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "white",
                },
              }}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
