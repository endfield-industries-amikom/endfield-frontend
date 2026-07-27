import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import netlifyReactRouter from "@netlify/vite-plugin-react-router";

export default defineConfig(({ mode }) => {
  const isLocal = process.env.DEPLOY_TARGET === "local";
  console.log("Building for", mode, "on Local:", isLocal)
  console.log(process.env.DEPLOY_TARGET)

  return {
    plugins: [
      reactRouter(),
      tailwindcss(),
      ...(!isLocal ? [netlifyReactRouter()] : []),
    ],
    resolve: {
      tsconfigPaths: true,
    },
  };
});
