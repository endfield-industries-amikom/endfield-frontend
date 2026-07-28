import { Card, CardContent, Grid, Skeleton } from "@mui/material";

interface SkeletonCardsProps {
  count?: number;
}

export default function SkeletonCards({ count = 4 }: SkeletonCardsProps) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Skeleton variant="text" width="50%" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" width="30%" sx={{ fontSize: "0.8rem", mt: 0.5 }} />
              <Skeleton variant="rectangular" height={60} sx={{ mt: 1.5, borderRadius: 1 }} />
              <Skeleton variant="text" width="40%" sx={{ fontSize: "0.9rem", mt: 1.5 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
