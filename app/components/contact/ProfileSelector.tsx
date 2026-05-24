import {
  Avatar,
  ButtonBase,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";
import type { IContactProfile } from "~/interfaces/IContactProfile";

interface ProfileSelectorProps {
  profiles: IContactProfile[];
  activeId: number;
  onSelect: (profile: IContactProfile) => void;
}

export default function ProfileSelector({
  profiles,
  activeId,
  onSelect,
}: ProfileSelectorProps) {
  return (
    <Paper
      elevation={6}
      sx={{
        px: { xs: 2, lg: 1.5 },
        py: { xs: 1.5, lg: 2 },
        borderRadius: "999px",
      }}
    >
      <Stack
        direction={{ xs: "row", lg: "column" }}
        spacing={1.5}
        sx={{ alignItems: "center" }}
      >
        {profiles.map((profile) => {
          const isActive = profile.id === activeId;
          return (
            <Tooltip key={profile.id} title={profile.name}>
              <ButtonBase
                onClick={() => onSelect(profile)}
                sx={{ borderRadius: "50%" }}
              >
                <Avatar
                  src={profile.avatar}
                  alt={profile.name}
                  sx={{
                    width: { xs: 52, sm: 60, lg: 48 },
                    height: { xs: 52, sm: 60, lg: 48 },
                    border: "2px solid",
                    borderColor: isActive ? "#004996" : "transparent",
                    opacity: isActive ? 1 : 0.7,
                    transform: isActive ? "scale(0.95)" : "scale(1)",
                    transition: "all 200ms ease",
                  }}
                />
              </ButtonBase>
            </Tooltip>
          );
        })}
      </Stack>
    </Paper>
  );
}
