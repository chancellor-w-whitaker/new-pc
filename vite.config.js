import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// const base = "/static";
const base = "";

// const outDir = base.substring(1);
const outDir = "docs";

// https://vitejs.dev/config/
export default defineConfig({
  // experimental: {
  //   renderBuiltUrl: (filename) =>
  //     `.${base}${filename[0] === "/" ? "" : "/"}${filename}`,
  // },
  build: { emptyOutDir: true, outDir },
  plugins: [react()],
  base,
});
