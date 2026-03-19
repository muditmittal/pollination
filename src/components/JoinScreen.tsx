"use client";

import { useState, useRef, useEffect } from "react";
import { AVATARS } from "@/lib/avatars";

interface Props {
  pollId: string;
  question: string;
  onJoined: () => void;
}

export default function JoinScreen({ pollId, question, onJoined }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarIndex, setAvatarIndex] = useState(
    () => Math.floor(Math.random() * AVATARS.length)
  );
  const [showGrid, setShowGrid] = useState(false);
  const [hoveredAvatar, setHoveredAvatar] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const cycleAvatar = () => {
    setAvatarIndex((prev) => (prev + 1) % AVATARS.length);
  };

  // Close grid on outside click
  useEffect(() => {
    if (!showGrid) return;
    const handleClick = (e: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(e.target as Node)) {
        setShowGrid(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showGrid]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/polls/${pollId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), avatarIndex }),
      });
      if (res.ok) {
        onJoined();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-4">
      {/* Avatar — tap to cycle, or open grid */}
      <div className="opacity-0 animate-scale-in">
        <button
          type="button"
          onClick={cycleAvatar}
          className="relative group"
          title="Click to change avatar"
        >
          <div
            className="w-24 h-24 rounded-3xl overflow-hidden bg-surface-raised border border-border-subtle p-3 transition-all duration-200 group-hover:border-lime/30 group-hover:scale-105 group-active:scale-95"
            dangerouslySetInnerHTML={{
              __html: AVATARS[avatarIndex].svg,
            }}
          />
          {/* Cycle hint — bottom right */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-surface-raised border border-border-subtle rounded-full flex items-center justify-center transition-all duration-200 group-hover:bg-lime group-hover:border-lime group-hover:text-surface">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
              />
            </svg>
          </div>
          {/* Grid picker — bottom left */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowGrid((v) => !v);
            }}
            className="absolute -bottom-1 -left-1 w-6 h-6 bg-surface-raised border border-border-subtle rounded-full flex items-center justify-center transition-all duration-200 hover:bg-lime hover:border-lime hover:text-surface cursor-pointer"
            title="Browse all avatars"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-3xl bg-lime/10 blur-xl -z-10" />
        </button>
        <p className="text-text-muted text-xs mt-2">
          {AVATARS[avatarIndex].name} &middot; tap to change
        </p>
      </div>

      {/* Avatar grid popup — fullscreen overlay */}
      {showGrid && (
        <>
          <div
            className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-40"
            onClick={() => setShowGrid(false)}
          />
          <div ref={gridRef} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-72 bg-surface border border-border-subtle rounded-2xl p-5 shadow-2xl animate-scale-in">
            <p className="text-text-secondary text-xs mb-3 text-center">
              {hoveredAvatar !== null ? AVATARS[hoveredAvatar].name : "Pick your avatar"}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((avatar, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAvatarIndex(i);
                    setShowGrid(false);
                    setHoveredAvatar(null);
                  }}
                  onMouseEnter={() => setHoveredAvatar(i)}
                  onMouseLeave={() => setHoveredAvatar(null)}
                  className={`w-12 h-12 rounded-xl overflow-hidden p-1.5 border transition-all duration-150 hover:scale-110 active:scale-95 ${
                    i === avatarIndex
                      ? "border-lime bg-lime-dim"
                      : "border-border-subtle bg-surface-raised hover:border-border-hover"
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: avatar.svg }} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="space-y-2 opacity-0 animate-slide-up stagger-1">
        <h2 className="font-display text-2xl font-bold">Join this poll</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
          &ldquo;{question}&rdquo;
        </p>
      </div>

      <form
        onSubmit={handleJoin}
        className="w-full max-w-xs space-y-4 opacity-0 animate-slide-up stagger-2"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3.5 bg-surface-raised border border-border-subtle rounded-2xl text-text-primary placeholder-text-muted focus:outline-none focus:border-lime/40 transition-all duration-200 text-center text-base"
          maxLength={30}
          autoFocus
          required
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full py-3.5 bg-lime text-surface font-bold rounded-2xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(190,242,100,0.2)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:shadow-none disabled:hover:scale-100"
        >
          {loading ? "Joining..." : "Join Poll"}
        </button>
      </form>
    </div>
  );
}
