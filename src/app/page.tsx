"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreatePollForm from "@/components/CreatePollForm";

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [lastVotedPoll, setLastVotedPoll] = useState<{
    id: string;
    question: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.redirect) {
          router.replace(data.redirect);
          return;
        }
        if (data.lastVotedPoll) {
          setLastVotedPoll(data.lastVotedPoll);
        }
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 opacity-0 animate-fade-in">
          <div className="w-8 h-8 border-2 border-lime/30 border-t-lime rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center mb-10 opacity-0 animate-slide-up">
        <h1 className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight mb-3 bg-gradient-to-b from-white to-text-secondary bg-clip-text text-transparent">
          Pollination
        </h1>
        <p className="text-text-muted text-sm tracking-wide">
          Create a poll. Share the link. Get answers.
        </p>
      </div>

      {/* Returning voter — show link to last poll */}
      {lastVotedPoll && (
        <div className="mb-8 opacity-0 animate-slide-up stagger-1">
          <a
            href={`/poll/${lastVotedPoll.id}`}
            className="glass-card flex items-center gap-3 px-5 py-3 hover:border-lime/20 transition-all duration-200 group"
          >
            {lastVotedPoll.status === "active" && (
              <div className="w-2 h-2 rounded-full bg-lime animate-pulse-soft shrink-0" />
            )}
            <span className="text-text-secondary text-sm">
              <span className="text-text-primary font-medium group-hover:text-lime transition-colors">
                {lastVotedPoll.question}
              </span>
              {" "}&middot;{" "}
              {lastVotedPoll.status === "active" ? "still live" : "ended"}
            </span>
            <svg
              className="w-4 h-4 text-text-muted group-hover:text-lime transition-colors shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      )}

      <div className="w-full max-w-[640px] opacity-0 animate-slide-up stagger-2">
        <CreatePollForm />
      </div>
    </main>
  );
}
