import { Box, Typography } from "@mui/material";

interface ProductsSectionHeaderProps {
  title: string;
  subtitle: string;
}

export default function ProductsSectionHeader({
  title,
  subtitle,
}: ProductsSectionHeaderProps) {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#202020",
          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "#202020", mt: 0.5, maxWidth: 520 }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}
