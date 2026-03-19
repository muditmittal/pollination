import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json(
      { error: "Prompt is required" },
      { status: 400 }
    );
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: prompt.trim(),
        },
      ],
      system: `You are a poll generator. Given a user's description of what they want to poll about, generate a clear poll question and 2-5 answer options (max 5 unless the user explicitly requests more).

Respond ONLY with valid JSON in this exact format, no other text:
{"question": "The poll question?", "options": ["Option A", "Option B", "Option C"]}

Rules:
- Keep the question concise and clear
- Options should be distinct and cover the likely answers
- Default to 3-4 options unless the topic naturally needs more or fewer
- Maximum 5 options unless the user explicitly asks for more (then up to 6)
- Make options fun and engaging when appropriate
- If the prompt is vague, make reasonable assumptions`,
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to generate poll" },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);

    if (!result.question || !Array.isArray(result.options) || result.options.length < 2) {
      return NextResponse.json(
        { error: "Invalid poll generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      question: result.question,
      options: result.options.slice(0, 6),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Generation error:", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
