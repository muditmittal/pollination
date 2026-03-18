"use client";

import { useEffect, useState, useCallback, use } from "react";
import JoinScreen from "@/components/JoinScreen";
import VoteCard from "@/components/VoteCard";
import ResultsView from "@/components/ResultsView";
import StatusBadge from "@/components/StatusBadge";
import ShareLink from "@/components/ShareLink";
import ParticipantList from "@/components/ParticipantList";

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

export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);

  const fetchPoll = useCallback(async () => {
    try {
      const res = await fetch(`/api/polls/${id}`);
      if (!res.ok) {
        setError(res.status === 404 ? "Poll not found" : "Something went wrong");
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

  // SSE connection
  useEffect(() => {
    if (!poll || poll.status === "ended") return;

    const eventSource = new EventSource(`/api/polls/${id}/stream`);

    eventSource.addEventListener("vote_cast", (e) => {
      const data = JSON.parse(e.data);
      setPoll((prev) =>
        prev ? { ...prev, voteCounts: data.voteCounts, totalVotes: data.totalVotes } : prev
      );
    });

    eventSource.addEventListener("participant_joined", (e) => {
      const data = JSON.parse(e.data);
      setPoll((prev) => {
        if (!prev) return prev;
        const exists = prev.participants.some((p) => p.id === data.id);
        if (exists) return prev;
        return {
          ...prev,
          participants: [...prev.participants, { ...data, hasVoted: false }],
        };
      });
    });

    eventSource.addEventListener("poll_ended", (e) => {
      const data = JSON.parse(e.data);
      setPoll((prev) =>
        prev
          ? { ...prev, status: "ended", voteCounts: data.voteCounts, totalVotes: data.totalVotes }
          : prev
      );
    });

    eventSource.onerror = () => {
      eventSource.close();
      setTimeout(fetchPoll, 2000);
    };

    return () => eventSource.close();
  }, [id, poll?.status, fetchPoll]);

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
        <div className="animate-pulse text-gray-400">Loading poll...</div>
      </main>
    );
  }

  if (error || !poll) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{error || "Not found"}</h1>
          <a href="/" className="text-emerald-400 hover:text-emerald-300">
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
    <main className="flex min-h-screen flex-col items-center p-6 pt-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <StatusBadge status={poll.status} />
          {poll.isCreator && poll.status === "active" && (
            <button
              onClick={handleEndPoll}
              disabled={ending}
              className="px-4 py-1.5 text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              {ending ? "Ending..." : "End Poll"}
            </button>
          )}
        </div>

        {poll.isCreator && poll.status === "active" && (
          <ShareLink pollId={poll.id} />
        )}

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          {showJoin && (
            <JoinScreen pollId={poll.id} question={poll.question} onJoined={fetchPoll} />
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

        {poll.participants.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400">
              Participants ({poll.participants.length})
            </h3>
            <ParticipantList participants={poll.participants} />
          </div>
        )}
      </div>
    </main>
  );
}
