import { Box, Button, Stack, Typography } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { useNavigate } from "react-router";

export default function ErrorFallback({
  error,
}: {
  error: Error | undefined;
}) {
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        p: 4,
        bgcolor: "background.default",
      }}
    >
      <SentimentVeryDissatisfiedIcon
        sx={{ fontSize: "6rem", color: "text.secondary", mb: 2 }}
      />

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Oops! Something went wrong
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 480 }}
      >
        We're sorry, but something unexpected happened. Please try again or
        contact the Endmin for assistance.
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Try Again
        </Button>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </Stack>

      {isDev && error && (
        <Box
          component="pre"
          sx={{
            mt: 4,
            p: 2,
            bgcolor: "grey.100",
            borderRadius: 1,
            maxWidth: 600,
            width: "100%",
            overflow: "auto",
            fontSize: "0.7rem",
            textAlign: "left",
            lineHeight: 1.4,
          }}
        >
          {error.stack || error.message}
        </Box>
      )}
    </Box>
  );
}
