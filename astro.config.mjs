import { fileURLToPath } from "node:url";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

function getGitHubPagesDefaults() {
  const repository = process.env.GITHUB_REPOSITORY;
  const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER;

  if (!repository || !repositoryOwner) {
    return {};
  }

  const repositoryName = repository.split("/").at(-1);

  if (!repositoryName) {
    return {};
  }

  if (repositoryName === `${repositoryOwner}.github.io`) {
    return {
      base: "/",
      site: `https://${repositoryOwner}.github.io`,
    };
  }

  return {
    base: `/${repositoryName}/`,
    site: `https://${repositoryOwner}.github.io/${repositoryName}`,
  };
}

const githubPagesDefaults = isGitHubPages ? getGitHubPagesDefaults() : {};

const site = process.env.SITE_URL ?? githubPagesDefaults.site;

const base = process.env.BASE_PATH ?? githubPagesDefaults.base ?? "/";

export default defineConfig({
  ...(site && { site }),
  base,
  integrations: [react()],
  output: "static",
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
