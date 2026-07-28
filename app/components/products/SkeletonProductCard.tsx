import { Box, Skeleton } from "@mui/material";

export default function SkeletonProductCard() {
  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <Skeleton variant="rectangular" width="100%" sx={{ height: 180 }} />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" sx={{ fontSize: "1rem" }} />
        <Skeleton variant="text" width="40%" sx={{ fontSize: "0.85rem", mt: 0.5 }} />
        <Skeleton variant="text" width="30%" sx={{ fontSize: "1.1rem", mt: 1 }} />
      </Box>
    </Box>
  );
}
