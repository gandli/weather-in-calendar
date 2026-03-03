// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

// Use default incremental cache strategy to avoid mandatory R2 binding in CI deploy.
export default defineCloudflareConfig({});
