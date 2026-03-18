import { NextRequest, NextResponse } from "next/server";
import { getPoll, getParticipants, getVoteCounts, getParticipant } from "@/lib/store";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const poll = getPoll(id);
  if (!poll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });

  const participantId = req.cookies.get(`participant_${id}`)?.value;
  const creatorToken = req.cookies.get(`creator_${id}`)?.value;
  const currentParticipant = participantId ? getParticipant(id, participantId) : null;

  return NextResponse.json({
    id: poll.id, question: poll.question, options: poll.options, status: poll.status,
    voteCounts: getVoteCounts(id),
    participants: getParticipants(id).map((p) => ({
      id: p.id, name: p.name, avatarIndex: p.avatarIndex, hasVoted: p.votedIndex !== null,
    })),
    currentParticipant: currentParticipant ? {
      id: currentParticipant.id, name: currentParticipant.name,
      avatarIndex: currentParticipant.avatarIndex, votedIndex: currentParticipant.votedIndex,
    } : null,
    isCreator: creatorToken === poll.creatorToken,
    totalVotes: getVoteCounts(id).reduce((a, b) => a + b, 0),
  });
}
