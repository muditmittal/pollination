"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Props {
  onGenerated: (question: string, options: string[]) => void;
}

const EXAMPLES = [
  "Best day for team lunch this week",
  "Which movie should we watch tonight",
  "Where should we go for our next offsite",
  "What programming language should I learn next",
  "Pineapple on pizza — settle this once and for all",
];

export default function AiPrompt({ onGenerated }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeholder] = useState(
    () => EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)]
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 80)}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [prompt, resize]);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      onGenerated(data.question, data.options);
      setPrompt("");
    } catch {
      setError("Failed to connect. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="space-y-4">
      {/* Textarea with embedded generate button */}
      <div className="relative glass-card p-5 pb-14 transition-all duration-300 focus-within:border-lime/20 focus-within:shadow-[0_0_30px_rgba(190,242,100,0.05)]">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus
          className="w-full bg-transparent text-text-primary placeholder-text-muted font-display text-xl sm:text-2xl font-bold leading-relaxed focus:outline-none"
          style={{ resize: "none", overflow: "hidden", minHeight: "80px" }}
        />

        {/* Generate button — bottom right of card */}
        <div className="absolute bottom-3 right-3 flex items-center gap-3">
          {error && (
            <span className="text-danger text-xs">{error}</span>
          )}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${
              prompt.trim()
                ? "bg-lime text-surface hover:shadow-[0_0_16px_rgba(190,242,100,0.3)] hover:scale-110 active:scale-95"
                : "bg-surface-hover text-text-muted"
            } disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none`}
            title="Generate poll (Enter)"
          >
            {loading ? (
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
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <p className="text-text-muted text-xs text-center">
        Describe what you want to poll about &middot; Enter to generate
      </p>
    </div>
  );
}
