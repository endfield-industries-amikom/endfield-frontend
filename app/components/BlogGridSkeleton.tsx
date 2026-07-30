import { Card, CardContent, Grid, Skeleton } from "@mui/material";

export default function BlogGridSkeleton() {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ borderRadius: 3, overflow: "hidden", height: "100%" }}>
            <Skeleton variant="rectangular" width="100%" height={220} />
            <CardContent>
              <Skeleton variant="text" width="80%" sx={{ fontSize: "1.25rem", mb: 1 }} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" />
              <Skeleton variant="text" width="40%" sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
