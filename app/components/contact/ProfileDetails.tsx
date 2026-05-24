import GitHubIcon from "@mui/icons-material/GitHub";
import {
  Card,
  CardContent,
  CardMedia,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import type { IContactProfile } from "~/interfaces/IContactProfile";

interface ProfileDetailsProps {
  profile: IContactProfile;
}

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  const githubUrl = profile.githubUrl ?? "https://github.com/placeholder";

  return (
    <Card
      elevation={6}
      sx={{ borderRadius: 3, overflow: "hidden", width: "100%" }}
    >
      <CardMedia
        component="img"
        image={profile.image}
        alt={profile.name}
        sx={{ height: { xs: 220, sm: 280, md: 320 } }}
      />
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography
          variant="overline"
          sx={{
            letterSpacing: 2,
            color: "text.secondary",
            fontWeight: 600,
          }}
        >
          {profile.role}
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mt: 1,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          }}
        >
          {profile.name}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary", mt: 1 }}>
          {profile.nim}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: "center" }}>
          <GitHubIcon fontSize="small" />
          <Link
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            underline="hover"
            color="inherit"
          >
            {githubUrl.replace("https://", "")}
          </Link>
        </Stack>
      </CardContent>
    </Card>
  );
}
