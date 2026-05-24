import { Box, Container, Link, Stack, Typography } from "@mui/material";
import { NavLink } from "react-router";
import { BRAND } from "./navigation";

const footerLinks = [
  { label: BRAND.name, to: "/" },
  { label: "About Us", to: "/about" },
  {
    label: "Contact Us: contact@endfieldindustries.com",
    to: "/contact",
  },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#202020", color: "#FAFAFA", mt: 8 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={1.5} sx={{ maxWidth: 360 }}>
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              component={NavLink}
              to={link.to}
              underline="none"
              sx={{ color: "inherit" }}
            >
              <Typography variant="body2">{link.label}</Typography>
            </Link>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
