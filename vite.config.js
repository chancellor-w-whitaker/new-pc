import { globalConst } from "vite-plugin-global-const";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// const base = "/static";
const base = "";

// const outDir = base.substring(1);
const outDir = "Y:/pc/v01";

const wrapperUrl = "https://irserver.eku.edu/libraries/remote/wrapper.cjs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    globalConst({
      wrapperUrl,
    }),
  ],
  // experimental: {
  //   renderBuiltUrl: (filename) =>
  //     `.${base}${filename[0] === "/" ? "" : "/"}${filename}`,
  // },
  build: { copyPublicDir: false, emptyOutDir: false, outDir },
  base,
});
