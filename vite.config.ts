import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import netlifyReactRouter from "@netlify/vite-plugin-react-router";

export default defineConfig(({ mode }) => {
  const isNetlify = process.env.DEPLOY_TARGET === "netlify";

  return {
    plugins: [
      tailwindcss(),
      ...(isNetlify ? [netlifyReactRouter()] : []),
      reactRouter(),
    ],
    resolve: {
      tsconfigPaths: true,
    },
  };
});
