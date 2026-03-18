"use client";

import { useState } from "react";

export default function ShareLink({ pollId }: { pollId: string }) {
  const [copied, setCopied] = useState(false);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/poll/${pollId}`
      : `/poll/${pollId}`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card flex items-center gap-2 p-2 pl-4">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <svg
          className="w-4 h-4 text-text-muted shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <span className="text-text-secondary text-sm truncate">{url}</span>
      </div>
      <button
        onClick={copy}
        className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap active:scale-95 ${
          copied
            ? "bg-lime/20 text-lime"
            : "bg-surface-hover text-text-primary hover:bg-lime hover:text-surface"
        }`}
      >
        {copied ? (
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Copied!
          </span>
        ) : (
          "Copy link"
        )}
      </button>
    </div>
  );
}
