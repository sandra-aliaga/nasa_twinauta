import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, searchForWorkspaceRoot } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // The examples data source imports JSON from ../contracts/examples.
      allow: [searchForWorkspaceRoot(process.cwd()), "../contracts"],
    },
  },
});
