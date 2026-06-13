import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  plugins: [], // هاد السطر هو اللي كايقلب عليه Cloudflare باش مايعطيش Error
  tanstackStart: {
    server: { entry: "server" },
  },
});
