import { NextRequest, NextResponse } from "next/server";
import { getPoll, castVote, getVoteCounts } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const poll = await getPoll(id);
  if (!poll)
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });

  const participantId = req.cookies.get(`participant_${id}`)?.value;
  if (!participantId)
    return NextResponse.json({ error: "Not joined" }, { status: 401 });

  const { optionIndex } = await req.json();
  if (typeof optionIndex !== "number")
    return NextResponse.json(
      { error: "optionIndex required" },
      { status: 400 }
    );

  const success = await castVote(id, participantId, optionIndex);
  if (!success)
    return NextResponse.json({ error: "Vote failed" }, { status: 400 });

  const voteCounts = await getVoteCounts(id);
  const totalVotes = voteCounts.reduce((a, b) => a + b, 0);
  return NextResponse.json({ voteCounts, totalVotes });
}
