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
  const [previewAvatar] = useState(() => Math.floor(Math.random() * AVATARS.length));

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/polls/${pollId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        onJoined();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div
        className="w-20 h-20 rounded-full overflow-hidden bg-gray-800 p-2"
        dangerouslySetInnerHTML={{ __html: AVATARS[previewAvatar].svg }}
      />
      <div>
        <h2 className="text-xl font-bold mb-1">Join this poll</h2>
        <p className="text-gray-400 text-sm">&ldquo;{question}&rdquo;</p>
      </div>
      <form onSubmit={handleJoin} className="w-full max-w-xs space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center"
          maxLength={30}
          autoFocus
          required
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
        >
          {loading ? "Joining..." : "Join Poll"}
        </button>
      </form>
    </div>
  );
}
