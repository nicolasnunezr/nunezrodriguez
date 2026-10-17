import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://nunezrodriguez.com",
  trailingSlash: "always",
  build: { format: "directory" },
  redirects: {
    "/experience": "/#experience",
    "/education": "/#education",
    "/projects": "/#projects",
    "/articles": "/#notes",
  },
});
