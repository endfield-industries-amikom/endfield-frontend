import { useState } from "react";
import { Form, redirect, useNavigation } from "react-router";
import type { Route } from "./+types/login";
import {
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { apiRequestFull } from "~/services/api.server";

/* ------------------------------------------------------------------ */
/*  Server‑side loader – redirect already‑logged‑in users             */
/* ------------------------------------------------------------------ */

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  if (cookie.includes("refresh_token=")) {
    return redirect("/dashboard");
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Server‑side action – login / register / logout (all private API)  */
/* ------------------------------------------------------------------ */

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const cookie = request.headers.get("Cookie") || "";

  /* ---- logout ---- */
  if (intent === "logout") {
    const headers = new Headers();
    try {
      const logoutRes = await apiRequestFull("/auth/logout", {
        method: "POST",
        body: {},
        cookie,
      });
      // Forward any Set‑Cookie the backend sends (clearing sessionId)
      const setCookie = logoutRes.headers.get("set-cookie");
      if (setCookie) headers.set("Set-Cookie", setCookie);
    } catch {
      // Still clear on our side even if backend call fails
    }
    // Fallback: clear sessionId cookie ourselves
    headers.set(
      "Set-Cookie",
      "sessionId=; Path=/; HttpOnly; Max-Age=0",
    );
    return redirect("/dashboard/auth/login", { headers });
  }

  /* ---- register / login ---- */
  const mode = formData.get("mode") as string;
  const email = (formData.get("email") as string).trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    if (mode === "register") {
      const username = (formData.get("username") as string).trim();
      if (!username || username.length < 3) {
        return { error: "Username must be at least 3 characters." };
      }
      // RegisterUserDto: { username, email, password }
      await apiRequestFull("/auth/register", {
        method: "POST",
        body: { username, email, password },
      });
    }

    // Always perform login (SignInDto: { email, password })
    const loginResult = await apiRequestFull<{
      data: { access_token: string; refreshToken: string };
    }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    // Forward Set‑Cookie (sessionId) from backend → browser
    // @fastify/session auto‑sets this when req.session is modified
    const headers = new Headers();
    const setCookie = loginResult.headers.get("set-cookie");
    if (setCookie) headers.set("Set-Cookie", setCookie);

    return redirect("/dashboard", { headers });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Authentication failed",
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Client component – pure UI, no direct API calls                   */
/* ------------------------------------------------------------------ */

export default function Login({
  actionData,
}: Route.ComponentProps) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const error = actionData?.error;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,.15) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className=" w-full min-h-screen overflow-hidden bg-[#ECE8D7] grid lg:grid-cols-2">
        <div
          className="relative min-h-[750px] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://automaton-media.com/en/wp-content/uploads/2025/11/endfiled-20251124-366890-header.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/75" />

          <div className="relative z-10 h-full flex flex-col justify-between p-9 text-white ml-4">
            <div className="flex items-center gap-4 ">
              <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
                <span className="font-bold text-black text-xl">EI</span>
              </div>

              <div>
                <h1 className="text-2xl font-bold">Endfield Industries</h1>
                <p className="text-sm text-gray-300">
                  Logistics Intelligence Platform
                </p>
              </div>
            </div>

            <div className="mb-50">
              <h2 className="text-6xl font-black leading-tight text-yellow-400">
                Supply Chain
                <br />
                Control
              </h2>
              <p className="mt-6 max-w-md text-gray-300 text-lg">
                The definitive operating system for global logistics. Real-time
                tracking, warehouse visibility, inventory intelligence, and
                workflow automation.
              </p>
              <div className="flex gap-10 mt-10">
                <div></div>
                <div></div>
              </div>
            </div>

            <div className="text-sm text-gray-400">
              <p className="text-green-400 text-xl font-bold">ONLINE</p>
              <p className="text-sm text-gray-400">NODE CLUSTER</p>
              © 2026 Endfield Industries
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-8 py-14">
          <Form method="post" className="w-full max-w-md">
            {/* Hidden fields for the action */}
            <input type="hidden" name="mode" value={mode} />
            <input type="hidden" name="role" value={role} />

            <h2 className="text-4xl font-bold text-[#222]">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-600 mt-3 mb-8">
              {mode === "login"
                ? "Enter your credentials to access dashboard."
                : "Register as a customer to get started."}
            </p>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Mode toggle – client-only UI state */}
            <ToggleButtonGroup
              value={mode}
              exclusive
              fullWidth
              onChange={(_, value) => {
                if (value) setMode(value);
              }}
              sx={{
                mb: 3,
                "& .MuiToggleButton-root": {
                  border: 0,
                  bgcolor: "#DDD8C6",
                  color: "#444",
                  py: 1.2,
                },
                "& .Mui-selected": {
                  bgcolor: "#EDE72A !important",
                  color: "#000",
                  fontWeight: "bold",
                },
              }}
            >
              <ToggleButton
                value="login"
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  transition: "all .35s ease",
                  "&:hover": {
                    bgcolor: "#fff84a",
                    transform: "translateY(-3px)",
                    boxShadow:
                      "0 0 20px rgba(237,231,42,.6), 0 0 40px rgba(237,231,42,.3)",
                  },
                  "&:active": { transform: "scale(.98)" },
                }}
              >
                LOGIN
              </ToggleButton>
              <ToggleButton
                value="register"
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  transition: "all .35s ease",
                  "&:hover": {
                    bgcolor: "#fff84a",
                    transform: "translateY(-3px)",
                    boxShadow:
                      "0 0 20px rgba(237,231,42,.6), 0 0 40px rgba(237,231,42,.3)",
                  },
                  "&:active": { transform: "scale(.98)" },
                }}
              >
                REGISTER
              </ToggleButton>
            </ToggleButtonGroup>

            <div className="space-y-6">
              {mode === "register" && (
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  variant="outlined"
                  required
                  sx={{ mb: 2 }}
                />
              )}
              <TextField
                fullWidth
                name="email"
                label="Email Address"
                variant="outlined"
                type="email"
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="outlined"
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{
                  py: 1.8,
                  mt: 2,
                  bgcolor: "#EDE72A",
                  color: "#000",
                  fontWeight: 700,
                  borderRadius: "12px",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all .35s ease",
                  "&:hover": {
                    bgcolor: "#fff84a",
                    transform: "translateY(-3px)",
                    boxShadow:
                      "0 0 20px rgba(237,231,42,.6), 0 0 40px rgba(237,231,42,.3)",
                  },
                  "&:active": { transform: "scale(.98)" },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: "#000" }} />
                ) : mode === "login" ? (
                  "AUTHORIZE ACCESS"
                ) : (
                  "CREATE ACCOUNT"
                )}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
