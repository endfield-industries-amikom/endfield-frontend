import { Link } from "react-router";
import type { Route } from "../+types/blog-detail";
import { get } from "~/services/api.server";
import { getAccessToken } from "~/services/auth-helper.server";
import type { IBlog } from "~/types";
import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { normalizeImageUrl } from "~/utils/image";

export async function loader({ request, params }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const token = await getAccessToken(cookie);
  const response = await get<{ data: IBlog }>(`/blog/${params.id}`, token, cookie);
  return { blog: response.data };
}

export default function BlogDetail({ loaderData }: Route.ComponentProps) {
  const blog = loaderData?.blog;
  if (!blog) return <Paper sx={{ p: 4 }}><Typography color="text.secondary">Blog not found.</Typography></Paper>;

  return (
    <Box>
      <Button component={Link} to="/dashboard/blogs" startIcon={<ArrowBackIcon />} sx={{ mb: 3, color: "text.secondary" }}>Back to Blogs</Button>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Blog Detail</Typography>
      <Paper sx={{ p: 4 }}>
        {blog.imageUri && (
          <Box component="img" src={normalizeImageUrl(blog.imageUri)} alt={blog.title}
            sx={{ width: "100%", borderRadius: 2, objectFit: "cover", maxHeight: 300, mb: 3 }} />
        )}
        <Typography variant="h4" sx={{ fontWeight: 700 }}>{blog.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {blog.author} • {new Date(blog.updatedAt).toLocaleDateString()}
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Typography sx={{ fontSize: 16, lineHeight: 1.8, whiteSpace: "pre-line" }}>
          {blog.content}
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: "flex", gap: 4 }}>
          <Typography variant="caption" color="text.secondary">Created: {new Date(blog.createdAt).toLocaleString()}</Typography>
          <Typography variant="caption" color="text.secondary">Updated: {new Date(blog.updatedAt).toLocaleString()}</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
