import { NextRequest, NextResponse } from "next/server";
import { endPoll } from "@/lib/store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const creatorToken = req.cookies.get(`creator_${id}`)?.value;
  if (!creatorToken)
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const success = await endPoll(id, creatorToken);
  if (!success)
    return NextResponse.json(
      { error: "Failed to end poll" },
      { status: 400 }
    );

  // Clear active_poll cookie so creator can make a new one
  const response = NextResponse.json({ success: true });
  response.cookies.set("active_poll", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
