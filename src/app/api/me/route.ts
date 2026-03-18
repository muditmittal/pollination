import { NextRequest, NextResponse } from "next/server";
import { getPoll } from "@/lib/store";

export async function GET(req: NextRequest) {
  const activePollId = req.cookies.get("active_poll")?.value;
  const lastVotedPollId = req.cookies.get("last_voted_poll")?.value;

  // Check if creator has an active poll
  if (activePollId) {
    const poll = await getPoll(activePollId);
    if (poll && poll.status === "active") {
      return NextResponse.json({
        redirect: `/poll/${activePollId}`,
        reason: "active_poll",
      });
    }
    // Poll ended or deleted — clear stale cookie
    const response = NextResponse.json({ redirect: null });
    response.cookies.set("active_poll", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  // Check if voter has a recent poll
  if (lastVotedPollId) {
    const poll = await getPoll(lastVotedPollId);
    if (poll) {
      return NextResponse.json({
        redirect: null,
        lastVotedPoll: {
          id: poll.id,
          question: poll.question,
          status: poll.status,
        },
      });
    }
  }

  return NextResponse.json({ redirect: null });
}
