// Builds the Overtron page. `base: "./"` keeps every path relative, so the build works
// wherever the jb/ site puts it (/OvertonParadox/overtron/). The excerpt is in public/data/v1/
// (written by `python -m overton.excerpt`, not in git) and is copied into the build.

import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  worker: { format: "es" },
  build: { target: "es2022", outDir: "dist" },
});
