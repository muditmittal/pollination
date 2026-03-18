"use client";

import { useState } from "react";

interface Props {
  pollId: string;
  question: string;
  options: string[];
  onVoted: () => void;
}

export default function VoteCard({
  pollId,
  question,
  options,
  onVoted,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (selected === null) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex: selected }),
      });
      if (res.ok) {
        onVoted();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <h2 className="font-display text-2xl font-bold opacity-0 animate-slide-up">
        {question}
      </h2>

      <div className="space-y-2.5">
        {options.map((option, index) => {
          const isSelected = selected === index;
          return (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left opacity-0 animate-slide-up hover:scale-[1.01] active:scale-[0.99] ${
                isSelected
                  ? "border-lime/40 bg-lime-dim shadow-[0_0_20px_rgba(190,242,100,0.08)]"
                  : "border-border-subtle bg-surface-raised hover:border-border-hover hover:bg-surface-hover"
              }`}
              style={{ animationDelay: `${(index + 1) * 0.06}s` }}
            >
              {/* Custom radio */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                  isSelected ? "border-lime" : "border-text-muted"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full bg-lime transition-all duration-200 ${
                    isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  }`}
                />
              </div>
              <span
                className={`transition-colors duration-200 ${
                  isSelected ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selected === null || loading}
        className="w-full py-3.5 bg-lime text-surface font-bold rounded-2xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(190,242,100,0.2)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:hover:shadow-none disabled:hover:scale-100 opacity-0 animate-slide-up"
        style={{ animationDelay: `${(options.length + 1) * 0.06}s` }}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Voting...
          </span>
        ) : (
          "Vote"
        )}
      </button>
    </div>
  );
}
