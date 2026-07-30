import { Suspense } from "react";
import { Await, useParams } from "react-router";
import { Box, Container, Typography, Divider, Skeleton } from "@mui/material";
import type { Route } from "./+types/slug";
import { get } from "~/services/api.server";
import type { IBlog } from "~/types/IBlog";
import { normalizeImageUrl } from "~/utils/image";

export async function loader({ params }: Route.LoaderArgs) {
  const blogPromise = get<{ data: IBlog }>(`/blog/${params.slug}`)
    .then((r) => r.data)
    .catch(() => null);
  return { blog: blogPromise };
}

export default function BlogDetail({ loaderData }: Route.ComponentProps) {
  return (
    <Suspense fallback={<BlogDetailSkeleton />}>
      <Await resolve={(loaderData as { blog: Promise<IBlog | null> }).blog}>
        {(blog) => {
          if (!blog) {
            return (
              <Container sx={{ py: 10 }}>
                <Typography variant="h4">Berita tidak ditemukan</Typography>
              </Container>
            );
          }

          return (
            <Box sx={{ bgcolor: "#fff", pb: 8 }}>
              <Container maxWidth="md">
                <Box
                  component="img"
                  src={normalizeImageUrl(blog.imageUri)}
                  sx={{
                    width: "100%",
                    height: 500,
                    objectFit: "cover",
                    borderRadius: 3,
                    mt: 5,
                  }}
                />

                <Typography
                  variant="h3"
                  sx={{ mt: 5, fontWeight: 700, lineHeight: 1.3 }}
                >
                  {blog.title}
                </Typography>

                <Typography sx={{ color: "text.secondary", mt: 2 }}>
                  {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>

                <Divider sx={{ my: 4 }} />

                <Typography
                  sx={{ fontSize: 18, lineHeight: 2, whiteSpace: "pre-line" }}
                >
                  {blog.content}
                </Typography>
              </Container>
            </Box>
          );
        }}
      </Await>
    </Suspense>
  );
}

function BlogDetailSkeleton() {
  return (
    <Box sx={{ bgcolor: "#fff", pb: 8 }}>
      <Container maxWidth="md">
        <Skeleton variant="rectangular" width="100%" height={500} sx={{ mt: 5, borderRadius: 3 }} />
        <Skeleton variant="text" width="70%" sx={{ fontSize: "3rem", mt: 5 }} />
        <Skeleton variant="text" width="30%" sx={{ fontSize: "1rem", mt: 2 }} />
        <Divider sx={{ my: 4 }} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="95%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="60%" />
      </Container>
    </Box>
  );
}
