import { NextRequest, NextResponse } from "next/server";
import { endPoll, getVoteCounts } from "@/lib/store";
import { broadcast } from "@/lib/sse";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creatorToken = req.cookies.get(`creator_${id}`)?.value;
  if (!creatorToken) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const success = endPoll(id, creatorToken);
  if (!success) return NextResponse.json({ error: "Failed to end poll" }, { status: 400 });

  const voteCounts = getVoteCounts(id);
  const totalVotes = voteCounts.reduce((a, b) => a + b, 0);
  broadcast(id, "poll_ended", { voteCounts, totalVotes });
  return NextResponse.json({ success: true });
}
