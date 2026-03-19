"use client";

import { useEffect, useState, useCallback, useRef, use } from "react";
import JoinScreen from "@/components/JoinScreen";
import VoteCard from "@/components/VoteCard";
import ResultsView from "@/components/ResultsView";
import StatusBadge from "@/components/StatusBadge";
import ShareLink from "@/components/ShareLink";
import ParticipantList from "@/components/ParticipantList";
import Confetti from "@/components/Confetti";

interface PollData {
  id: string;
  question: string;
  options: string[];
  status: "active" | "ended";
  voteCounts: number[];
  totalVotes: number;
  participants: {
    id: string;
    name: string;
    avatarIndex: number;
    hasVoted: boolean;
  }[];
  currentParticipant: {
    id: string;
    name: string;
    avatarIndex: number;
    votedIndex: number | null;
  } | null;
  isCreator: boolean;
}

export default function PollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);
  const [justEnded, setJustEnded] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const prevStatus = useRef<string | null>(null);

  const fetchPoll = useCallback(async () => {
    try {
      const res = await fetch(`/api/polls/${id}`);
      if (!res.ok) {
        setError(
          res.status === 404 ? "Poll not found" : "Something went wrong"
        );
        return;
      }
      const data = await res.json();
      setPoll(data);
    } catch {
      setError("Failed to load poll");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  // Detect poll ending → trigger confetti + delayed CTA
  useEffect(() => {
    if (poll?.status === "ended" && prevStatus.current === "active") {
      setJustEnded(true);
      setTimeout(() => setShowCta(true), 1200);
    }
    // Also show CTA immediately if page loads with ended poll
    if (poll?.status === "ended" && prevStatus.current === null) {
      setShowCta(true);
    }
    if (poll) {
      prevStatus.current = poll.status;
    }
  }, [poll?.status]);

  // Short polling for live updates (Vercel-compatible, replaces SSE)
  useEffect(() => {
    if (!poll || poll.status === "ended") return;

    const interval = setInterval(() => {
      fetchPoll();
    }, 3000);

    return () => clearInterval(interval);
  }, [poll?.status, fetchPoll]);

  const handleEndPoll = async () => {
    setEnding(true);
    try {
      await fetch(`/api/polls/${id}/end`, { method: "POST" });
      await fetchPoll();
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4 opacity-0 animate-fade-in">
          <div className="w-8 h-8 border-2 border-lime/30 border-t-lime rounded-full animate-spin" />
          <span className="text-text-muted text-sm">Loading poll...</span>
        </div>
      </main>
    );
  }

  if (error || !poll) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center opacity-0 animate-scale-in">
          <div className="text-4xl mb-4">:(</div>
          <h1 className="font-display text-xl font-bold mb-2">
            {error || "Not found"}
          </h1>
          <a
            href="/"
            className="text-lime text-sm hover:underline underline-offset-4"
          >
            Create a new poll
          </a>
        </div>
      </main>
    );
  }

  const isEnded = poll.status === "ended";
  const hasJoined = poll.currentParticipant !== null;
  const hasVoted = poll.currentParticipant?.votedIndex !== null;

  const showResults = isEnded || (hasJoined && hasVoted);
  const showVote = !isEnded && hasJoined && !hasVoted;
  const showJoin = !isEnded && !hasJoined;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 pt-16">
      <Confetti trigger={justEnded} />
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between opacity-0 animate-slide-up">
          <StatusBadge status={poll.status} />
          {poll.isCreator && poll.status === "active" && (
            <button
              onClick={handleEndPoll}
              disabled={ending}
              className="px-4 py-1.5 text-xs font-medium border border-danger/20 text-danger/80 hover:bg-danger-dim hover:text-danger rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {ending ? "Ending..." : "End Poll"}
            </button>
          )}
        </div>

        {/* Share link */}
        {poll.isCreator && poll.status === "active" && (
          <div className="opacity-0 animate-slide-up stagger-1">
            <ShareLink pollId={poll.id} />
          </div>
        )}

        {/* Main content card */}
        <div className="glass-card p-8 opacity-0 animate-scale-in stagger-2">
          {showJoin && (
            <JoinScreen
              pollId={poll.id}
              question={poll.question}
              onJoined={() => fetchPoll()}
            />
          )}
          {showVote && (
            <VoteCard
              pollId={poll.id}
              question={poll.question}
              options={poll.options}
              onVoted={fetchPoll}
            />
          )}
          {showResults && (
            <ResultsView
              question={poll.question}
              options={poll.options}
              voteCounts={poll.voteCounts}
              totalVotes={poll.totalVotes}
            />
          )}
        </div>

        {/* Participants */}
        {poll.participants.length > 0 && (
          <div className="space-y-3 opacity-0 animate-slide-up stagger-3">
            <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Participants ({poll.participants.length})
            </h3>
            <ParticipantList participants={poll.participants} />
          </div>
        )}

        {/* Create new poll CTA — for voters who voted, or ended polls */}
        {((isEnded && showCta) || (!poll.isCreator && hasVoted)) && (
          <div className={`text-center pt-2 ${justEnded ? "animate-bounce-in" : "opacity-0 animate-slide-up stagger-4"}`}>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-lime text-surface font-bold rounded-2xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(190,242,100,0.2)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create new poll
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
