import { NextRequest, NextResponse } from "next/server";
import { getPoll, addParticipant, getUsedAvatarIndices } from "@/lib/store";
import { AVATARS } from "@/lib/avatars";
import { broadcast } from "@/lib/sse";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const poll = getPoll(id);
  if (!poll) return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  if (poll.status !== "active") return NextResponse.json({ error: "Poll has ended" }, { status: 400 });

  const existingId = req.cookies.get(`participant_${id}`)?.value;
  if (existingId) return NextResponse.json({ error: "Already joined" }, { status: 400 });

  const { name } = await req.json();
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const usedIndices = getUsedAvatarIndices(id);
  const allIndices = Array.from({ length: AVATARS.length }, (_, i) => i);
  const available = allIndices.filter((i) => !usedIndices.includes(i));
  const avatarIndex = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : Math.floor(Math.random() * AVATARS.length);

  const participant = addParticipant(id, name.trim(), avatarIndex);
  if (!participant) return NextResponse.json({ error: "Failed to join" }, { status: 500 });

  broadcast(id, "participant_joined", {
    id: participant.id, name: participant.name, avatarIndex: participant.avatarIndex,
  });

  const response = NextResponse.json({
    id: participant.id, name: participant.name, avatarIndex: participant.avatarIndex,
  });
  response.cookies.set(`participant_${id}`, participant.id, {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24,
  });
  return response;
}
