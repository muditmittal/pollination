import { NextRequest, NextResponse } from "next/server";
import { createPoll } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { question, options } = await req.json();
  if (!question || !options || options.length < 2 || options.length > 6) {
    return NextResponse.json({ error: "Question and 2-6 options required" }, { status: 400 });
  }
  const poll = createPoll(question, options);
  const response = NextResponse.json({ id: poll.id, shareUrl: `/poll/${poll.id}` });
  response.cookies.set(`creator_${poll.id}`, poll.creatorToken, {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24,
  });
  return response;
}
