import { ImageResponse } from "next/og";
import { getPoll } from "@/lib/store";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const poll = await getPoll(id);

  if (!poll) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            background: "#0c0c14",
            color: "#f0f0f0",
            fontSize: 40,
            fontFamily: "sans-serif",
          }}
        >
          Poll not found
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const isLive = poll.status === "active";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#0c0c14",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: 24,
              fontWeight: 800,
              color: "#8a8a9a",
              letterSpacing: "-0.02em",
            }}
          >
            Pollination
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "100px",
              background: isLive
                ? "rgba(190, 242, 100, 0.15)"
                : "rgba(255,255,255,0.06)",
              color: isLive ? "#bef264" : "#8a8a9a",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            {isLive ? "● LIVE" : "ENDED"}
          </div>
        </div>

        {/* Question */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#f0f0f0",
            lineHeight: 1.2,
            marginBottom: "40px",
            letterSpacing: "-0.02em",
            maxHeight: "200px",
            overflow: "hidden",
          }}
        >
          {poll.question}
        </div>

        {/* Options */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flex: 1,
          }}
        >
          {poll.options.slice(0, 4).map((option, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px 24px",
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "2px solid #55556a",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 24,
                  color: "#8a8a9a",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {option}
              </span>
            </div>
          ))}
          {poll.options.length > 4 && (
            <div style={{ fontSize: 20, color: "#55556a", paddingLeft: "24px" }}>
              +{poll.options.length - 4} more option{poll.options.length - 4 > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
