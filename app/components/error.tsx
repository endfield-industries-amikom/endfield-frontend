import { Close, ErrorOutlineOutlined } from "@mui/icons-material";
import { Box, Button, IconButton, Paper, Slide, Stack, Typography } from "@mui/material";
import { useState } from "react";

export default function Error({ message, error }: { message: string; error: Error | undefined }) {
  const [dismissed, setDismissed] = useState(false);
  const isDev = import.meta.env.DEV;

  return (
    <Slide direction="up" in={!dismissed}>
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: "auto", md: 24 },
          top: { xs: 16, md: "auto" },
          left: { xs: 16, md: "auto" },
          right: { xs: 16, md: 24 },
          zIndex: 9999,
          maxWidth: 420,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 2.5,
            borderRadius: 2,
            borderLeft: 4,
            borderColor: "error.main",
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
            <ErrorOutlineOutlined color="error" sx={{ mt: 0.3 }} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Something went wrong
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, wordBreak: "break-word" }}
              >
                {message}
              </Typography>

              {isDev && error instanceof Error && error.stack && (
                <Box
                  component="pre"
                  sx={{
                    mt: 1.5,
                    p: 1,
                    bgcolor: "grey.100",
                    borderRadius: 1,
                    overflow: "auto",
                    maxHeight: 140,
                    fontSize: "0.65rem",
                    lineHeight: 1.4,
                  }}
                >
                  {error.stack}
                </Box>
              )}

              <Button
                size="small"
                variant="outlined"
                onClick={() => setDismissed(true)}
                sx={{ mt: 1.5 }}
              >
                Try Again
              </Button>
            </Box>

            <IconButton
              size="small"
              onClick={() => setDismissed(true)}
              sx={{ mt: -0.3, mr: -0.5 }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Stack>
        </Paper>
      </Box>
    </Slide>
  );
}
