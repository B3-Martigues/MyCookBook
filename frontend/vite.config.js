import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiOrigin = env.VITE_API_URL ?? (command === "serve" ? "http://localhost:8080" : "");

  return {
    plugins: [
      react(),
      {
        name: "configurable-api-origin",
        transform(code, id) {
          if (!id.includes("/src/") && !id.includes("\\src\\")) return null;
          return code.replaceAll("http://localhost:8080", apiOrigin);
        },
      },
    ],
  };
});
