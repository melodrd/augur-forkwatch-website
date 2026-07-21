import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Keep vitest's default excludes, and skip the local ".bun-install" package
    // cache (gitignored) so its bundled dependency tests are never collected.
    exclude: [...configDefaults.exclude, "**/.bun-install/**"],
    environment: "node",
  },
});
