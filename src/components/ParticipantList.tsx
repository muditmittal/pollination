import { getAvatar } from "@/lib/avatars";

interface ParticipantData {
  id: string;
  name: string;
  avatarIndex: number;
  hasVoted: boolean;
}

export default function ParticipantList({ participants }: { participants: ParticipantData[] }) {
  if (participants.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {participants.map((p) => (
        <div
          key={p.id}
          className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-full px-3 py-1.5"
          title={p.name}
        >
          <div
            className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0"
            dangerouslySetInnerHTML={{ __html: getAvatar(p.avatarIndex).svg }}
          />
          <span className="text-sm text-gray-300 max-w-[100px] truncate">{p.name}</span>
          {p.hasVoted && (
            <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
