// SSE replaced with short polling for Vercel compatibility.
// Clients poll GET /api/polls/[id] every few seconds instead.
// Keeping this route to avoid 404s from any lingering connections.

import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const newUrl = url.pathname.replace("/stream", "");
  return Response.redirect(new URL(newUrl, url.origin), 307);
}
