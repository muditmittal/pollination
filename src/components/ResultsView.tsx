interface Props {
  question: string;
  options: string[];
  voteCounts: number[];
  totalVotes: number;
}

export default function ResultsView({ question, options, voteCounts, totalVotes }: Props) {
  const maxCount = Math.max(...voteCounts, 1);

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold">{question}</h2>
      <div className="space-y-4">
        {options.map((option, index) => {
          const count = voteCounts[index] || 0;
          const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const isLeading = count === maxCount && count > 0;

          return (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-gray-200 text-sm">{option}</span>
                <span className="text-gray-400 text-sm tabular-nums">
                  {count} vote{count !== 1 ? "s" : ""} ({percentage}%)
                </span>
              </div>
              <div className="w-full h-8 bg-gray-800 rounded-lg overflow-hidden">
                <div
                  className={`h-full rounded-lg animate-bar ${
                    isLeading ? "bg-emerald-500" : "bg-gray-600"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-gray-500 text-sm text-center">
        {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
