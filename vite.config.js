import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const base = "/static";

// https://vitejs.dev/config/
export default defineConfig({
  experimental: {
    renderBuiltUrl: (filename) =>
      `.${base}${filename[0] === "/" ? "" : "/"}${filename}`,
  },
  build: { outDir: base.substring(1), emptyOutDir: true },
  plugins: [react()],
  base,
});
