"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={1}
      className={className}
      style={{ resize: "none", overflow: "hidden" }}
      {...props}
    />
  );
}

export default function CreatePollForm() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  const addOption = () => {
    if (options.length < 6) setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || trimmedOptions.length < 2) return;

    setLoading(true);
    try {
      const res = await fetch("/api/polls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          options: trimmedOptions,
        }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/poll/${data.id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full bg-transparent border-0 border-b-2 border-transparent text-text-primary placeholder-text-muted font-display focus:outline-none focus:border-lime/50 transition-all duration-300 pb-2";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[640px] space-y-10">
      {/* Question */}
      <div className="space-y-3">
        <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">
          Your question
        </label>
        <AutoResizeTextarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What do you want to ask?"
          className={`${inputBase} text-3xl font-bold leading-snug py-3`}
          autoFocus
          required
        />
      </div>

      {/* Options */}
      <div className="space-y-5">
        <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">
          Options
        </label>
        <div className="space-y-4">
          {options.map((option, index) => (
            <div
              key={index}
              className="group flex items-center gap-3 opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-raised border border-border-subtle text-text-muted text-sm font-medium shrink-0 transition-colors duration-200 group-focus-within:border-lime/30 group-focus-within:text-lime/70">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <AutoResizeTextarea
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className={`${inputBase} text-2xl leading-normal py-2`}
                  required
                />
              </div>
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="p-2 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="flex items-center gap-2 text-text-secondary hover:text-lime text-sm font-medium transition-all duration-200 hover:gap-3 ml-10"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add option
          </button>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 bg-lime text-surface font-bold text-base rounded-2xl transition-all duration-200 hover:shadow-[0_0_30px_rgba(190,242,100,0.2)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:shadow-none disabled:hover:scale-100"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
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
            Creating...
          </span>
        ) : (
          "Create Poll"
        )}
      </button>
    </form>
  );
}
