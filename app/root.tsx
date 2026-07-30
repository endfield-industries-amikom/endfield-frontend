import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import "./app.css";
import ErrorFallback from "./components/error-fallback";

/* LINKS */
export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function meta() {
  return [{ title: "Endfield Industries" }];
}

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#F8F546",
      contrastText: "#2A2A2A",
    },
    secondary: {
      main: "#202020",
      contrastText: "#FAFAFA",
    },
    background: {
      default: "#FAFAFA",
    },
  },
  typography: {
    fontFamily: '"Helvetica", "Inter", ui-sans-serif, system-ui, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
          color: "#2A2A2A"
        },
        contained: {
          color: "#2A2A2A",
        },
        outlined: {
          borderColor: "#C2C2C2",
          color: "#2A2A2A",
          "&:hover": {
            borderColor: "#202020",
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#202020",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#202020",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: any) {
  return <ErrorFallback error={error} />;
}
