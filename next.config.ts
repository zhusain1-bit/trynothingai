import type { NextConfig } from "next";

// Baseline security headers applied to every route.
// (A strict CSP is omitted intentionally — the UI relies heavily on inline styles,
// so a meaningful CSP would require 'unsafe-inline' and add little value.)
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },                 // no embedding → clickjacking protection
  { key: "X-Content-Type-Options", value: "nosniff" },       // no MIME sniffing
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
