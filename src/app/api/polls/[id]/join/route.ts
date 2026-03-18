import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { getPoll, addParticipant } from "@/lib/store";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const poll = await getPoll(id);
  if (!poll)
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  if (poll.status !== "active")
    return NextResponse.json({ error: "Poll has ended" }, { status: 400 });

  const existingId = req.cookies.get(`participant_${id}`)?.value;
  if (existingId)
    return NextResponse.json({ error: "Already joined" }, { status: 400 });

  const { name, avatarIndex } = await req.json();
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  if (typeof avatarIndex !== "number" || avatarIndex < 0 || avatarIndex > 19) {
    return NextResponse.json(
      { error: "Valid avatarIndex required" },
      { status: 400 }
    );
  }

  const participantId = nanoid(12);
  const participant = await addParticipant(
    participantId,
    id,
    name.trim(),
    avatarIndex
  );

  const response = NextResponse.json({
    id: participant.id,
    name: participant.name,
    avatarIndex: participant.avatarIndex,
  });

  response.cookies.set(`participant_${id}`, participant.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });

  // Track last voted poll for returning voters
  response.cookies.set("last_voted_poll", id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });

  return response;
}
