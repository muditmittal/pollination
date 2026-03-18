"use client";

import { useState } from "react";

interface Props {
  pollId: string;
  question: string;
  options: string[];
  onVoted: () => void;
}

export default function VoteCard({ pollId, question, options, onVoted }: Props) {
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
      <h2 className="text-xl font-bold">{question}</h2>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
              selected === index
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-gray-700 bg-gray-900 hover:border-gray-500"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                selected === index ? "border-emerald-500" : "border-gray-500"
              }`}
            >
              {selected === index && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              )}
            </div>
            <span className="text-gray-200">{option}</span>
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected === null || loading}
        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors"
      >
        {loading ? "Submitting..." : "Vote"}
      </button>
    </div>
  );
}
