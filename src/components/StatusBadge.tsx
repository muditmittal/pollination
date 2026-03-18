export default function StatusBadge({
  status,
}: {
  status: "active" | "ended";
}) {
  return status === "active" ? (
    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime-dim text-lime text-xs font-semibold tracking-wide uppercase rounded-full border border-lime/20">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-50" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-lime" />
      </span>
      Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-surface-raised text-text-muted text-xs font-semibold tracking-wide uppercase rounded-full border border-border-subtle">
      Ended
    </span>
  );
}
