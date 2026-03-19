"use client";

import { useState, useMemo } from "react";
import { getAvatar } from "@/lib/avatars";

interface ParticipantData {
  id: string;
  name: string;
  avatarIndex: number;
  hasVoted: boolean;
}

// Approximate: each chip is ~120px wide, container max is ~512px (max-w-lg minus padding)
// So roughly 4 chips per row — 3 rows = 12 items per page
const ITEMS_PER_PAGE = 12;

export default function ParticipantList({
  participants,
}: {
  participants: ParticipantData[];
}) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const visible = useMemo(
    () => participants.slice(0, visibleCount),
    [participants, visibleCount]
  );

  const remaining = participants.length - visibleCount;

  if (participants.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {visible.map((p, i) => (
          <div
            key={p.id}
            className="group flex items-center gap-2 bg-surface-raised border border-border-subtle rounded-full px-3 py-1.5 opacity-0 animate-scale-in hover:border-border-hover hover:bg-surface-hover transition-all duration-200"
            style={{ animationDelay: `${i * 0.05}s` }}
            title={p.name}
          >
            <div
              className="w-6 h-6 rounded-full overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-110"
              dangerouslySetInnerHTML={{ __html: getAvatar(p.avatarIndex).svg }}
            />
            <span className="text-sm text-text-secondary max-w-[100px] truncate">
              {p.name}
            </span>
            {p.hasVoted && (
              <svg
                className="w-3.5 h-3.5 text-lime shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisibleCount((v) => v + ITEMS_PER_PAGE)}
          className="text-xs text-text-muted hover:text-text-secondary transition-colors duration-200"
        >
          Show more ({remaining} remaining)
        </button>
      )}
    </div>
  );
}
