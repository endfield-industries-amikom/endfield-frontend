import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import type { IBlog } from "~/interfaces/IBlog";

interface BlogCardProps {
  blog: IBlog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link
      to={`/blog/${blog.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Card
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          height: "100%",
          transition: ".3s",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          height="220"
          image={blog.imageUri || "/HeroSection.webp"}
          alt={blog.title}
        />

        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              lineHeight: 1.4,
              mb: 1,
            }}
          >
            {blog.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {blog.content}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 2,
            }}
          >
            {blog.author} • {blog.date}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}