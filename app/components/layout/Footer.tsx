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
<Box
  component="footer"
  sx={{
    position: "relative",
    overflow: "hidden",
    bgcolor: "#202020",
    color: "#FAFAFA",

    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      backgroundImage: "url('/wave.png'), url('/wave.png')",
      backgroundSize: "700px 500px",

      opacity: 0.25,

      // Fade from transparent → visible → transparent
      maskImage:
        "linear-gradient(to right, black 0%, black 20%, transparent 35%, transparent 65%, black 80%, black 100%)",
      WebkitMaskImage:
        "linear-gradient(to right, black 0%, black 5%, transparent 20%, transparent 80%, black 95%, black 100%)",
    },

    "& > *": {
      position: "relative",
      zIndex: 1,
    },
  }}
>
  <Container
    maxWidth="lg"
    sx={{
      py: 4,

    }}
  >
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
