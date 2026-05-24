import { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import ProfileDetails from "~/components/contact/ProfileDetails";
import ProfileSelector from "~/components/contact/ProfileSelector";
import { contactProfiles } from "~/data/ContactProfiles";

export default function Contact() {
  const [activeProfile, setActiveProfile] = useState(contactProfiles[0]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 6 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={{ xs: 3, md: 4 }}
          sx={{ alignItems: { xs: "stretch", lg: "flex-start" } }}
        >
          <ProfileSelector
            profiles={contactProfiles}
            activeId={activeProfile.id}
            onSelect={setActiveProfile}
          />
          <ProfileDetails profile={activeProfile} />
        </Stack>
      </Container>
    </Box>
  );
}
