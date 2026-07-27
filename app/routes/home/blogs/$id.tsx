import { Box, Container, Typography, Divider } from "@mui/material";
import { useParams } from "react-router";
import { blogs } from "~/data/Blogs";

export default function BlogDetail() {
  const { id } = useParams();

  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <Container sx={{ py: 10 }}>
        <Typography variant="h4">
          Berita tidak ditemukan
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fff", pb: 8 }}>
      <Container maxWidth="md">

        <Box
          component="img"
          src={blog.imageUri}
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
          sx={{
            mt: 5,
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          {blog.title}
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            mt: 2,
          }}
        >
          {blog.author} • {blog.date}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography
          sx={{
            fontSize: 18,
            lineHeight: 2,
            whiteSpace: "pre-line",
          }}
        >
          {blog.content}
        </Typography>

      </Container>
    </Box>
  );
}