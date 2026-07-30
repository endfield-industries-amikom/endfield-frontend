import { Box, Container, Paper, Skeleton } from "@mui/material";

export default function ProductDetailSkeleton() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 6 }}>
      <Container maxWidth="lg">
        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 2 }}>
          <Box
            sx={{
              display: "grid",
              gap: 5,
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            }}
          >
            <Box sx={{ borderRadius: 3, bgcolor: "grey.100", p: 3 }}>
              <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, justifyContent: "center" }}>
              <Skeleton variant="text" width="70%" sx={{ fontSize: "2rem" }} />
              <Skeleton variant="text" width="40%" sx={{ fontSize: "1.1rem" }} />
              <Skeleton variant="text" width="30%" sx={{ fontSize: "1.5rem", mt: 2 }} />
              <Skeleton variant="text" width="90%" sx={{ mt: 2 }} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ mt: 6, p: 4, borderRadius: 4, boxShadow: 2 }}>
          <Skeleton variant="text" width="30%" sx={{ fontSize: "1.5rem" }} />
          <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 2, borderRadius: 2 }} />
        </Paper>
      </Container>
    </Box>
  );
}
