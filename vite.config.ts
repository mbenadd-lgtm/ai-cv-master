import { defineConfig } from "@lovable.dev/vite-tanstack-config";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare({
    viteEnvironment: {
      name: "ssr"
    }
  })], // هاد السطر هو اللي كايقلب عليه Cloudflare باش مايعطيش Error
  tanstackStart: {
    server: { entry: "server" },
  },
});