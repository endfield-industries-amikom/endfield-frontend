import { useState } from "react";
import Typography from "@mui/material/Typography";
import {
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("employee");

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
                <span className="font-bold text-black text-xl">
                  EI
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  Endfield Industries
                </h1>

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
                The definitive operating system for global logistics.
                Real-time tracking, warehouse visibility,
                inventory intelligence, and workflow automation.
              </p>

              <div className="flex gap-10 mt-10">
                <div>
                </div>

                <div>
                
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-400">
              <p className="text-green-400 text-xl font-bold">
                    ONLINE
                  </p>

                  <p className="text-sm text-gray-400">
                    NODE CLUSTER
                  </p>
              © 2026 Endfield Industries
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-8 py-14">
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold text-[#222]">
              Welcome Back
            </h2>

            <p className="text-gray-600 mt-3 mb-8">
              Enter your credentials to access dashboard.
            </p>

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
              <ToggleButton value="login" 
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

                  "&:active": {
                    transform: "scale(.98)",
                  },
              }}
              >
                LOGIN
              </ToggleButton>

              <ToggleButton value="register"
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

                  "&:active": {
                    transform: "scale(.98)",
                  },
              }}>
                REGISTER
              </ToggleButton>
            </ToggleButtonGroup>

                      <div
              className={`mb-7 ${
                mode === "register"
                  ? "flex justify-center"
                  : "grid grid-cols-2 gap-4"
              }`}
            >
              {mode === "login" && (
                <Button
                  variant={role === "employee" ? "contained" : "outlined"}
                  onClick={() => setRole("employee")}
                  sx={{
                    "&.MuiButton-root": {
                    borderRadius: "16px",
                  },
                    py: 1.2,
                    bgcolor: role === "employee" ? "#EDE72A" : "transparent",
                    color: "#000",
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: "0 8px 24px rgba(237,231,42,0.25)",
                    transition: "all .3s ease",
                    "&:hover": {
                      bgcolor: "#f7f14a",
                      transform: "translateY(-4px) scale(1.02)",
                      boxShadow: "0 16px 40px rgba(237,231,42,0.45)",
                    },
                    "&:active": {
                      transform: "translateY(0) scale(.98)",
                    },
                  }}
                >
                  EMPLOYEE
                </Button>
              )}

              <Button
                variant={role === "consumer" ? "contained" : "outlined"}
                onClick={() => setRole("consumer")}
                sx={{
                  "&.MuiButton-root": {
                    borderRadius: "16px",
                  },
                  py: 1.5,
                  bgcolor: role === "consumer" ? "#EDE72A" : "transparent",
                  color: "#000",
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0 8px 24px rgba(237,231,42,0.25)",
                  transition: "all .3s ease",
                  "&:hover": {
                    bgcolor: "#f7f14a",
                    transform: "translateY(-4px) scale(1.02)",
                    boxShadow: "0 16px 40px rgba(237,231,42,0.45)",
                    
                  },
                  "&:active": {
                    transform: "translateY(0) scale(.98)",
                  },
                }}
              >
                CONSUMER
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs text-gray-500">
                OR EMAIL
              </span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <div className="space-y-6">
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                sx={{
                  mb: 2,
                }}
              />

              <TextField
                fullWidth
                type="password"
                label="Password"
                variant="outlined"
              />

              <Button
                fullWidth
                variant="contained"
                onClick={()=> {document.cookie = "auth=true; path=/;"; window.location.href="/dashboard"}}
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

                  "&:active": {
                    transform: "scale(.98)",
                  },
                }}
              >
                AUTHORIZE ACCESS
              </Button>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              Secure Environment • AES-256 Encryption Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}