import { Box, Grid, Paper, Skeleton } from "@mui/material";

const skeletonCards = [
  { color: "warning.light" },
  { color: "info.light" },
  { color: "success.light" },
  { color: "secondary.light" },
];

export default function DashboardIndexSkeleton() {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {skeletonCards.map((card, i) => (
        <Grid key={i} size={{ xs: 6, md: 3 }}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: card.color,
            }}
          >
            <Skeleton variant="circular" width={40} height={40} />
            <Box>
              <Skeleton variant="text" width={80} />
              <Skeleton variant="text" width={40} sx={{ fontSize: "2rem" }} />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
