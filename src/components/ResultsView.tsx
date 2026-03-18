interface Props {
  question: string;
  options: string[];
  voteCounts: number[];
  totalVotes: number;
}

export default function ResultsView({
  question,
  options,
  voteCounts,
  totalVotes,
}: Props) {
  const maxCount = Math.max(...voteCounts, 1);

  return (
    <div className="w-full space-y-6">
      <h2 className="font-display text-2xl font-bold opacity-0 animate-slide-up">
        {question}
      </h2>

      <div className="space-y-4">
        {options.map((option, index) => {
          const count = voteCounts[index] || 0;
          const percentage =
            totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const isLeading = count === maxCount && count > 0;

          return (
            <div
              key={index}
              className="space-y-2 opacity-0 animate-slide-up"
              style={{ animationDelay: `${(index + 1) * 0.08}s` }}
            >
              <div className="flex justify-between items-baseline gap-4">
                <span
                  className={`text-sm font-medium ${
                    isLeading ? "text-lime" : "text-text-secondary"
                  }`}
                >
                  {option}
                </span>
                <span className="text-text-muted text-xs tabular-nums whitespace-nowrap">
                  {percentage}%
                  <span className="ml-1.5 text-text-muted/60">
                    ({count})
                  </span>
                </span>
              </div>
              <div className="w-full h-9 bg-surface-raised rounded-xl overflow-hidden border border-border-subtle">
                <div
                  className={`h-full rounded-xl animate-bar-fill transition-all duration-700 ease-out relative overflow-hidden ${
                    isLeading
                      ? "bg-gradient-to-r from-lime/80 to-lime"
                      : "bg-surface-hover"
                  }`}
                  style={{ width: `${percentage}%` }}
                >
                  {/* Subtle shimmer on leading bar */}
                  {isLeading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-text-muted text-xs text-center pt-2">
        {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
