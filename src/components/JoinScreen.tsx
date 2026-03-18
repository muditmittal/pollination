"use client";

import { useState } from "react";
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

  const cycleAvatar = () => {
    setAvatarIndex((prev) => (prev + 1) % AVATARS.length);
  };

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
      {/* Avatar — tap to cycle */}
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
          {/* Tap hint */}
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
          <div className="absolute inset-0 rounded-3xl bg-lime/10 blur-xl -z-10" />
        </button>
        <p className="text-text-muted text-xs mt-2">
          {AVATARS[avatarIndex].name} &middot; tap to change
        </p>
      </div>

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
