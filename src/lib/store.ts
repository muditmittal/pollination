import { nanoid } from "nanoid";

export interface Poll {
  id: string;
  question: string;
  options: string[];
  status: "active" | "ended";
  createdAt: Date;
  creatorToken: string;
}

export interface Participant {
  id: string;
  name: string;
  avatarIndex: number;
  votedIndex: number | null;
}

// --- In-memory storage ---
const polls = new Map<string, Poll>();
const participants = new Map<string, Map<string, Participant>>();

// --- Poll CRUD ---
export function createPoll(question: string, options: string[]): Poll {
  const id = nanoid(8);
  const creatorToken = nanoid(16);
  const poll: Poll = {
    id,
    question,
    options,
    status: "active",
    createdAt: new Date(),
    creatorToken,
  };
  polls.set(id, poll);
  participants.set(id, new Map());
  return poll;
}

export function getPoll(id: string): Poll | undefined {
  return polls.get(id);
}

export function endPoll(id: string, token: string): boolean {
  const poll = polls.get(id);
  if (!poll || poll.creatorToken !== token) return false;
  poll.status = "ended";
  return true;
}

// --- Participants ---
export function addParticipant(
  pollId: string,
  name: string,
  avatarIndex: number
): Participant | null {
  const pollParticipants = participants.get(pollId);
  if (!pollParticipants) return null;
  const id = nanoid(12);
  const participant: Participant = { id, name, avatarIndex, votedIndex: null };
  pollParticipants.set(id, participant);
  return participant;
}

export function getParticipant(
  pollId: string,
  participantId: string
): Participant | undefined {
  return participants.get(pollId)?.get(participantId);
}

export function getParticipants(pollId: string): Participant[] {
  const pollParticipants = participants.get(pollId);
  if (!pollParticipants) return [];
  return Array.from(pollParticipants.values());
}

export function castVote(
  pollId: string,
  participantId: string,
  optionIndex: number
): boolean {
  const poll = polls.get(pollId);
  if (!poll || poll.status !== "active") return false;
  const participant = participants.get(pollId)?.get(participantId);
  if (!participant || participant.votedIndex !== null) return false;
  if (optionIndex < 0 || optionIndex >= poll.options.length) return false;
  participant.votedIndex = optionIndex;
  return true;
}

export function getVoteCounts(pollId: string): number[] {
  const poll = polls.get(pollId);
  if (!poll) return [];
  const counts = new Array(poll.options.length).fill(0);
  const pollParticipants = participants.get(pollId);
  if (pollParticipants) {
    for (const p of pollParticipants.values()) {
      if (p.votedIndex !== null) {
        counts[p.votedIndex]++;
      }
    }
  }
  return counts;
}

export function getUsedAvatarIndices(pollId: string): number[] {
  const pollParticipants = participants.get(pollId);
  if (!pollParticipants) return [];
  return Array.from(pollParticipants.values()).map((p) => p.avatarIndex);
}
