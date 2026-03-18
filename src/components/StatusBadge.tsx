export default function StatusBadge({ status }: { status: "active" | "ended" }) {
  return status === "active" ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-full border border-emerald-500/30">
      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
      Live
    </span>
  ) : (
    <span className="inline-flex items-center px-3 py-1 bg-gray-700/50 text-gray-400 text-sm font-semibold rounded-full border border-gray-600/30">
      Ended
    </span>
  );
}
