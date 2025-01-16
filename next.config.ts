import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove experimental config since it's not needed in Next.js 15
};

export default withPayload(nextConfig);
