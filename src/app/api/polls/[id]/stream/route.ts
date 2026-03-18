import { NextRequest } from "next/server";
import { getPoll } from "@/lib/store";
import { addClient, removeClient } from "@/lib/sse";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const poll = getPoll(id);
  if (!poll) return new Response("Poll not found", { status: 404 });

  const stream = new ReadableStream({
    start(controller) {
      const client = addClient(id, controller);
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(": heartbeat\n\n"));
      req.signal.addEventListener("abort", () => { removeClient(client); });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
