"use client";

import { useState } from "react";

export default function ShareLink({ pollId }: { pollId: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/poll/${pollId}`
    : `/poll/${pollId}`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl p-2 pl-4">
      <span className="text-gray-300 text-sm truncate flex-1">{url}</span>
      <button
        onClick={copy}
        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
      >
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
