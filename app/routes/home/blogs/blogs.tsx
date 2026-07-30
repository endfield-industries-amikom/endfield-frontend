import { Suspense } from "react";
import { Await } from "react-router";
import BlogCard from "~/components/data/BlogCard";
import BlogGridSkeleton from "~/components/BlogGridSkeleton";
import { get } from "~/services/api.server";
import type { IBlog } from "~/types/IBlog";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { Route } from "./+types/blogs";

export async function loader() {
  const blogsPromise = get<{ data: { data: IBlog[] } }>("/blog").then((r) => r.data.data);
  return { blogs: blogsPromise };
}

export const meta: Route.MetaFunction = () => {
  return [{ title: "Blogs | Endfield" }];
};

export default function Blogs({ loaderData }: Route.ComponentProps) {
  return (
    <Box sx={{ bgcolor: "#f8f8f8", minHeight: "100vh", pb: 5 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero */}
        <Box
          sx={{
            position: "relative",
            borderRadius: 3,
            overflow: "hidden",
            mb: 5,
          }}
        >
          <img
            src="/HeroSection.webp"
            alt="Hero"
            style={{
              width: "100%",
              height: 450,
              objectFit: "cover",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 60,
              transform: "translateY(-50%)",
              color: "white",
              maxWidth: 500,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Berita dan Informasi
            </Typography>

            <Typography>
              Membangun Kepercayaan Masyarakat kepada Endfield Industries melalui Transparansi
              dan Keterbukaan Informasi.
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: "#202020",
          }}
        >
          NEWS
        </Typography>

        <Typography sx={{ mt: 1, mb: 4 }}>
          Cari informasi tentang Telkom yang Anda perlukan menggunakan filter
          ini.
        </Typography>

        {/* Filter */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr 1fr 2fr",
            },
            gap: 2,
            mb: 5,
          }}
        >
          <TextField select label="Category" defaultValue="">
            <MenuItem value="">All</MenuItem>
          </TextField>

          <TextField select label="Year" defaultValue="">
            <MenuItem value="">2025</MenuItem>
            <MenuItem value="">2024</MenuItem>
          </TextField>

          <TextField select label="Month" defaultValue="">
            <MenuItem value="">January</MenuItem>
            <MenuItem value="">February</MenuItem>
          </TextField>

          <TextField
            fullWidth
            placeholder="Search..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Card Grid */}
        <Suspense fallback={<BlogGridSkeleton />}>
          <Await resolve={(loaderData as { blogs: Promise<IBlog[]> }).blogs}>
            {(blogs: IBlog[]) => (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2,1fr)",
                    md: "repeat(3,1fr)",
                  },
                  gap: 3,
                }}
              >
                {blogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </Box>
            )}
          </Await>
        </Suspense>
      </Container>
    </Box>
  );
}
