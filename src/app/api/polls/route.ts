import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createPoll, cleanupPolls } from "@/lib/store";

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function POST(req: NextRequest) {
  const { question, options } = await req.json();
  if (!question || !options || options.length < 2 || options.length > 6) {
    return NextResponse.json(
      { error: "Question and 2-6 options required" },
      { status: 400 }
    );
  }

  // Run cleanup lazily
  cleanupPolls().catch(() => {});

  const id = nanoid(8);
  const creatorToken = nanoid(16);
  const poll = await createPoll(id, question, options, creatorToken);

  const response = NextResponse.json({
    id: poll.id,
    shareUrl: `/poll/${poll.id}`,
  });

  response.cookies.set(`creator_${poll.id}`, poll.creatorToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });

  // Track active poll for returning user
  response.cookies.set("active_poll", poll.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });

  return response;
}
