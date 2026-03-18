# Polling App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real-time polling app with shareable URLs, auto-assigned avatars, live voting, and Google Polls-style simplicity.

**Architecture:** Next.js 14 App Router handles both UI and API. In-memory Maps store polls/participants/votes. SSE streams push real-time updates to all connected clients. Cookie-based identity for creator and participant tracking — no auth system.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, nanoid

---

## File Structure

```
~/polling-app/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, dark theme, Inter font
│   │   ├── page.tsx                # Home — renders CreatePollForm
│   │   ├── globals.css             # Tailwind imports + custom animations
│   │   └── poll/
│   │       └── [id]/
│   │           └── page.tsx        # Main poll experience (4 states)
│   ├── components/
│   │   ├── CreatePollForm.tsx      # Question + dynamic options (2-6)
│   │   ├── JoinScreen.tsx          # Name input + avatar preview
│   │   ├── VoteCard.tsx            # Google Polls-style radio card
│   │   ├── ResultsView.tsx         # Animated bar chart + counts
│   │   ├── ParticipantList.tsx     # Row of avatar bubbles
│   │   ├── StatusBadge.tsx         # "Live" green / "Ended" gray pill
│   │   └── ShareLink.tsx           # URL display + copy button
│   ├── lib/
│   │   ├── store.ts               # In-memory Maps + CRUD helpers
│   │   ├── avatars.ts             # 20 avatar definitions (inline SVG strings)
│   │   └── sse.ts                 # SSE connection manager + broadcast
│   └── app/api/
│       └── polls/
│           ├── route.ts            # POST create poll
│           └── [id]/
│               ├── route.ts        # GET poll state
│               ├── join/
│               │   └── route.ts    # POST join poll
│               ├── vote/
│               │   └── route.ts    # POST cast vote
│               ├── end/
│               │   └── route.ts    # POST end poll
│               └── stream/
│                   └── route.ts    # GET SSE stream
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

- [ ] **Step 1: Create Next.js project**

```bash
cd ~/polling-app
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Accept defaults. This scaffolds the full project with App Router, TypeScript, Tailwind.

- [ ] **Step 2: Install dependencies**

```bash
cd ~/polling-app
npm install nanoid@5
```

- [ ] **Step 3: Update root layout for dark theme**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pollify",
  description: "Quick, fun polls with live results",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-gray-950 text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Replace globals.css**

Replace `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-bar {
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
```

- [ ] **Step 5: Add placeholder home page**

Replace `src/app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-bold">Pollify</h1>
    </main>
  );
}
```

- [ ] **Step 6: Verify dev server starts**

```bash
cd ~/polling-app && npm run dev
```

Expected: Server starts on localhost:3000, shows "Pollify" centered on dark background.

- [ ] **Step 7: Commit**

```bash
cd ~/polling-app && git init && git add -A && git commit -m "feat: scaffold Next.js project with dark theme"
```

---

## Task 2: Avatar System

**Files:**
- Create: `src/lib/avatars.ts`

- [ ] **Step 1: Create avatar definitions**

Create `src/lib/avatars.ts` with 20 inline SVG avatar definitions. Each avatar is a fun character — animals, food, objects. Each entry has a `name` and `svg` string (64x64 viewBox, simple colorful shapes).

The avatars should be:
1. Fox, 2. Octopus, 3. Robot, 4. Cactus, 5. Pizza, 6. Penguin, 7. Ghost, 8. Unicorn, 9. Alien, 10. Taco, 11. Cat, 12. Panda, 13. Rocket, 14. Donut, 15. Owl, 16. Mushroom, 17. Dinosaur, 18. Cloud, 19. Avocado, 20. Bee

```tsx
export interface Avatar {
  name: string;
  svg: string; // complete <svg>...</svg> string
}

export const AVATARS: Avatar[] = [
  // 20 entries, each with fun colorful inline SVG
  // Example structure for each:
  {
    name: "Fox",
    svg: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">...</svg>`,
  },
  // ... 19 more
];

export function getAvatar(index: number): Avatar {
  return AVATARS[index % AVATARS.length];
}
```

Each SVG should be a simple, recognizable, colorful character — think emoji-style. Use solid fills, no strokes, 3-5 shapes per avatar max. Make them visually distinct from each other.

- [ ] **Step 2: Commit**

```bash
cd ~/polling-app && git add src/lib/avatars.ts && git commit -m "feat: add 20 inline SVG avatar definitions"
```

---

## Task 3: In-Memory Store

**Files:**
- Create: `src/lib/store.ts`

- [ ] **Step 1: Create the store module**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
cd ~/polling-app && git add src/lib/store.ts && git commit -m "feat: add in-memory poll store with CRUD helpers"
```

---

## Task 4: SSE Manager

**Files:**
- Create: `src/lib/sse.ts`

- [ ] **Step 1: Create the SSE module**

```typescript
type SSEClient = {
  controller: ReadableStreamDefaultController;
  pollId: string;
};

const clients = new Map<string, Set<SSEClient>>();

export function addClient(
  pollId: string,
  controller: ReadableStreamDefaultController
): SSEClient {
  if (!clients.has(pollId)) {
    clients.set(pollId, new Set());
  }
  const client: SSEClient = { controller, pollId };
  clients.get(pollId)!.add(client);
  return client;
}

export function removeClient(client: SSEClient) {
  clients.get(client.pollId)?.delete(client);
}

export function broadcast(
  pollId: string,
  event: string,
  data: Record<string, unknown>
) {
  const pollClients = clients.get(pollId);
  if (!pollClients) return;
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  const encoder = new TextEncoder();
  for (const client of pollClients) {
    try {
      client.controller.enqueue(encoder.encode(message));
    } catch {
      pollClients.delete(client);
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/polling-app && git add src/lib/sse.ts && git commit -m "feat: add SSE connection manager with broadcast"
```

---

## Task 5: API Routes

**Files:**
- Create: `src/app/api/polls/route.ts`
- Create: `src/app/api/polls/[id]/route.ts`
- Create: `src/app/api/polls/[id]/join/route.ts`
- Create: `src/app/api/polls/[id]/vote/route.ts`
- Create: `src/app/api/polls/[id]/end/route.ts`
- Create: `src/app/api/polls/[id]/stream/route.ts`

- [ ] **Step 1: POST /api/polls — Create poll**

`src/app/api/polls/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { createPoll } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { question, options } = await req.json();

  if (!question || !options || options.length < 2 || options.length > 6) {
    return NextResponse.json(
      { error: "Question and 2-6 options required" },
      { status: 400 }
    );
  }

  const poll = createPoll(question, options);

  const response = NextResponse.json({
    id: poll.id,
    shareUrl: `/poll/${poll.id}`,
  });

  // Set creator token as httpOnly cookie
  response.cookies.set(`creator_${poll.id}`, poll.creatorToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}
```

- [ ] **Step 2: GET /api/polls/[id] — Get poll state**

`src/app/api/polls/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import {
  getPoll,
  getParticipants,
  getVoteCounts,
  getParticipant,
} from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const poll = getPoll(id);
  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  const participantId = req.cookies.get(`participant_${id}`)?.value;
  const creatorToken = req.cookies.get(`creator_${id}`)?.value;
  const currentParticipant = participantId
    ? getParticipant(id, participantId)
    : null;

  return NextResponse.json({
    id: poll.id,
    question: poll.question,
    options: poll.options,
    status: poll.status,
    voteCounts: getVoteCounts(id),
    participants: getParticipants(id).map((p) => ({
      id: p.id,
      name: p.name,
      avatarIndex: p.avatarIndex,
      hasVoted: p.votedIndex !== null,
    })),
    currentParticipant: currentParticipant
      ? {
          id: currentParticipant.id,
          name: currentParticipant.name,
          avatarIndex: currentParticipant.avatarIndex,
          votedIndex: currentParticipant.votedIndex,
        }
      : null,
    isCreator: creatorToken === poll.creatorToken,
    totalVotes: getVoteCounts(id).reduce((a, b) => a + b, 0),
  });
}
```

- [ ] **Step 3: POST /api/polls/[id]/join — Join poll**

`src/app/api/polls/[id]/join/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import {
  getPoll,
  addParticipant,
  getUsedAvatarIndices,
} from "@/lib/store";
import { AVATARS } from "@/lib/avatars";
import { broadcast } from "@/lib/sse";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const poll = getPoll(id);
  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }
  if (poll.status !== "active") {
    return NextResponse.json({ error: "Poll has ended" }, { status: 400 });
  }

  // Check if already joined
  const existingId = req.cookies.get(`participant_${id}`)?.value;
  if (existingId) {
    return NextResponse.json(
      { error: "Already joined" },
      { status: 400 }
    );
  }

  const { name } = await req.json();
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  // Pick avatar — prefer unused
  const usedIndices = getUsedAvatarIndices(id);
  const allIndices = Array.from({ length: AVATARS.length }, (_, i) => i);
  const available = allIndices.filter((i) => !usedIndices.includes(i));
  const avatarIndex =
    available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : Math.floor(Math.random() * AVATARS.length);

  const participant = addParticipant(id, name.trim(), avatarIndex);
  if (!participant) {
    return NextResponse.json({ error: "Failed to join" }, { status: 500 });
  }

  broadcast(id, "participant_joined", {
    id: participant.id,
    name: participant.name,
    avatarIndex: participant.avatarIndex,
  });

  const response = NextResponse.json({
    id: participant.id,
    name: participant.name,
    avatarIndex: participant.avatarIndex,
  });

  response.cookies.set(`participant_${id}`, participant.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}
```

- [ ] **Step 4: POST /api/polls/[id]/vote — Cast vote**

`src/app/api/polls/[id]/vote/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getPoll, castVote, getVoteCounts } from "@/lib/store";
import { broadcast } from "@/lib/sse";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const poll = getPoll(id);
  if (!poll) {
    return NextResponse.json({ error: "Poll not found" }, { status: 404 });
  }

  const participantId = req.cookies.get(`participant_${id}`)?.value;
  if (!participantId) {
    return NextResponse.json({ error: "Not joined" }, { status: 401 });
  }

  const { optionIndex } = await req.json();
  if (typeof optionIndex !== "number") {
    return NextResponse.json(
      { error: "optionIndex required" },
      { status: 400 }
    );
  }

  const success = castVote(id, participantId, optionIndex);
  if (!success) {
    return NextResponse.json(
      { error: "Vote failed — already voted, poll ended, or invalid option" },
      { status: 400 }
    );
  }

  const voteCounts = getVoteCounts(id);
  const totalVotes = voteCounts.reduce((a, b) => a + b, 0);

  broadcast(id, "vote_cast", { voteCounts, totalVotes });

  return NextResponse.json({ voteCounts, totalVotes });
}
```

- [ ] **Step 5: POST /api/polls/[id]/end — End poll**

`src/app/api/polls/[id]/end/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { endPoll, getVoteCounts } from "@/lib/store";
import { broadcast } from "@/lib/sse";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const creatorToken = req.cookies.get(`creator_${id}`)?.value;

  if (!creatorToken) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const success = endPoll(id, creatorToken);
  if (!success) {
    return NextResponse.json(
      { error: "Failed to end poll" },
      { status: 400 }
    );
  }

  const voteCounts = getVoteCounts(id);
  const totalVotes = voteCounts.reduce((a, b) => a + b, 0);

  broadcast(id, "poll_ended", { voteCounts, totalVotes });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 6: GET /api/polls/[id]/stream — SSE endpoint**

`src/app/api/polls/[id]/stream/route.ts`:

```typescript
import { NextRequest } from "next/server";
import { getPoll } from "@/lib/store";
import { addClient, removeClient } from "@/lib/sse";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const poll = getPoll(id);
  if (!poll) {
    return new Response("Poll not found", { status: 404 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const client = addClient(id, controller);

      // Send initial heartbeat
      const encoder = new TextEncoder();
      controller.enqueue(encoder.encode(": heartbeat\n\n"));

      // Cleanup on close
      req.signal.addEventListener("abort", () => {
        removeClient(client);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

- [ ] **Step 7: Commit**

```bash
cd ~/polling-app && git add src/app/api/ && git commit -m "feat: add all API routes — create, get, join, vote, end, stream"
```

---

## Task 6: CreatePollForm Component + Home Page

**Files:**
- Create: `src/components/CreatePollForm.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Build CreatePollForm**

`src/components/CreatePollForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        body: JSON.stringify({ question: question.trim(), options: trimmedOptions }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/poll/${data.id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Your question
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What do you want to ask?"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          required
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-400">
          Options
        </label>
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
            <input
              type="text"
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}

        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add option
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
      >
        {loading ? "Creating..." : "Create Poll"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Update home page**

Replace `src/app/page.tsx`:

```tsx
import CreatePollForm from "@/components/CreatePollForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Pollify</h1>
        <p className="text-gray-400">Create a poll. Share the link. Get answers.</p>
      </div>
      <CreatePollForm />
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd ~/polling-app && git add src/components/CreatePollForm.tsx src/app/page.tsx && git commit -m "feat: add CreatePollForm and home page"
```

---

## Task 7: StatusBadge, ShareLink, ParticipantList Components

**Files:**
- Create: `src/components/StatusBadge.tsx`
- Create: `src/components/ShareLink.tsx`
- Create: `src/components/ParticipantList.tsx`

- [ ] **Step 1: StatusBadge**

`src/components/StatusBadge.tsx`:

```tsx
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
```

- [ ] **Step 2: ShareLink**

`src/components/ShareLink.tsx`:

```tsx
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
```

- [ ] **Step 3: ParticipantList**

`src/components/ParticipantList.tsx`:

```tsx
import { getAvatar } from "@/lib/avatars";

interface ParticipantData {
  id: string;
  name: string;
  avatarIndex: number;
  hasVoted: boolean;
}

export default function ParticipantList({
  participants,
}: {
  participants: ParticipantData[];
}) {
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
          <span className="text-sm text-gray-300 max-w-[100px] truncate">
            {p.name}
          </span>
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
```

- [ ] **Step 4: Commit**

```bash
cd ~/polling-app && git add src/components/StatusBadge.tsx src/components/ShareLink.tsx src/components/ParticipantList.tsx && git commit -m "feat: add StatusBadge, ShareLink, ParticipantList components"
```

---

## Task 8: JoinScreen Component

**Files:**
- Create: `src/components/JoinScreen.tsx`

- [ ] **Step 1: Build JoinScreen**

`src/components/JoinScreen.tsx`:

```tsx
"use client";

import { useState } from "react";
import { AVATARS } from "@/lib/avatars";

interface Props {
  pollId: string;
  question: string;
  onJoined: () => void;
}

export default function JoinScreen({ pollId, question, onJoined }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  // Show a random preview avatar (actual assignment happens server-side)
  const [previewAvatar] = useState(
    () => Math.floor(Math.random() * AVATARS.length)
  );

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/polls/${pollId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        onJoined();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div
        className="w-20 h-20 rounded-full overflow-hidden bg-gray-800 p-2"
        dangerouslySetInnerHTML={{ __html: AVATARS[previewAvatar].svg }}
      />
      <div>
        <h2 className="text-xl font-bold mb-1">Join this poll</h2>
        <p className="text-gray-400 text-sm">&ldquo;{question}&rdquo;</p>
      </div>
      <form onSubmit={handleJoin} className="w-full max-w-xs space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center"
          maxLength={30}
          autoFocus
          required
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
        >
          {loading ? "Joining..." : "Join Poll"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/polling-app && git add src/components/JoinScreen.tsx && git commit -m "feat: add JoinScreen with avatar preview"
```

---

## Task 9: VoteCard Component

**Files:**
- Create: `src/components/VoteCard.tsx`

- [ ] **Step 1: Build VoteCard**

`src/components/VoteCard.tsx` — mimics Google Polls style: radio buttons, clean layout, submit at bottom.

```tsx
"use client";

import { useState } from "react";

interface Props {
  pollId: string;
  question: string;
  options: string[];
  onVoted: () => void;
}

export default function VoteCard({ pollId, question, options, onVoted }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (selected === null) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex: selected }),
      });
      if (res.ok) {
        onVoted();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <h2 className="text-xl font-bold">{question}</h2>
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
              selected === index
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-gray-700 bg-gray-900 hover:border-gray-500"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                selected === index
                  ? "border-emerald-500"
                  : "border-gray-500"
              }`}
            >
              {selected === index && (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              )}
            </div>
            <span className="text-gray-200">{option}</span>
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={selected === null || loading}
        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-colors"
      >
        {loading ? "Submitting..." : "Vote"}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/polling-app && git add src/components/VoteCard.tsx && git commit -m "feat: add VoteCard with Google Polls-style radio buttons"
```

---

## Task 10: ResultsView Component

**Files:**
- Create: `src/components/ResultsView.tsx`

- [ ] **Step 1: Build ResultsView**

`src/components/ResultsView.tsx`:

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
cd ~/polling-app && git add src/components/ResultsView.tsx && git commit -m "feat: add ResultsView with animated bar chart"
```

---

## Task 11: Poll Page — Orchestrating All States

**Files:**
- Create: `src/app/poll/[id]/page.tsx`

This is the main page that handles all 4 states: join, vote, live results, final results.

- [ ] **Step 1: Build the poll page**

`src/app/poll/[id]/page.tsx`:

```tsx
"use client";

import { useEffect, useState, useCallback, use } from "react";
import JoinScreen from "@/components/JoinScreen";
import VoteCard from "@/components/VoteCard";
import ResultsView from "@/components/ResultsView";
import StatusBadge from "@/components/StatusBadge";
import ShareLink from "@/components/ShareLink";
import ParticipantList from "@/components/ParticipantList";

interface PollData {
  id: string;
  question: string;
  options: string[];
  status: "active" | "ended";
  voteCounts: number[];
  totalVotes: number;
  participants: {
    id: string;
    name: string;
    avatarIndex: number;
    hasVoted: boolean;
  }[];
  currentParticipant: {
    id: string;
    name: string;
    avatarIndex: number;
    votedIndex: number | null;
  } | null;
  isCreator: boolean;
}

export default function PollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);

  const fetchPoll = useCallback(async () => {
    try {
      const res = await fetch(`/api/polls/${id}`);
      if (!res.ok) {
        setError(res.status === 404 ? "Poll not found" : "Something went wrong");
        return;
      }
      const data = await res.json();
      setPoll(data);
    } catch {
      setError("Failed to load poll");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPoll();
  }, [fetchPoll]);

  // SSE connection
  useEffect(() => {
    if (!poll || poll.status === "ended") return;

    const eventSource = new EventSource(`/api/polls/${id}/stream`);

    eventSource.addEventListener("vote_cast", (e) => {
      const data = JSON.parse(e.data);
      setPoll((prev) =>
        prev ? { ...prev, voteCounts: data.voteCounts, totalVotes: data.totalVotes } : prev
      );
    });

    eventSource.addEventListener("participant_joined", (e) => {
      const data = JSON.parse(e.data);
      setPoll((prev) => {
        if (!prev) return prev;
        const exists = prev.participants.some((p) => p.id === data.id);
        if (exists) return prev;
        return {
          ...prev,
          participants: [
            ...prev.participants,
            { ...data, hasVoted: false },
          ],
        };
      });
    });

    eventSource.addEventListener("poll_ended", (e) => {
      const data = JSON.parse(e.data);
      setPoll((prev) =>
        prev
          ? { ...prev, status: "ended", voteCounts: data.voteCounts, totalVotes: data.totalVotes }
          : prev
      );
    });

    eventSource.onerror = () => {
      eventSource.close();
      // Reconnect after a short delay by re-fetching state
      setTimeout(fetchPoll, 2000);
    };

    return () => eventSource.close();
  }, [id, poll?.status, fetchPoll]);

  const handleEndPoll = async () => {
    setEnding(true);
    try {
      await fetch(`/api/polls/${id}/end`, { method: "POST" });
      await fetchPoll();
    } finally {
      setEnding(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading poll...</div>
      </main>
    );
  }

  if (error || !poll) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{error || "Not found"}</h1>
          <a href="/" className="text-emerald-400 hover:text-emerald-300">
            Create a new poll
          </a>
        </div>
      </main>
    );
  }

  // Determine which state to show
  const isEnded = poll.status === "ended";
  const hasJoined = poll.currentParticipant !== null;
  const hasVoted = poll.currentParticipant?.votedIndex !== null;

  // Ended polls: show results directly (no join needed)
  // Active + not joined: show join screen
  // Active + joined + not voted: show vote card
  // Active + joined + voted: show live results
  const showResults = isEnded || (hasJoined && hasVoted);
  const showVote = !isEnded && hasJoined && !hasVoted;
  const showJoin = !isEnded && !hasJoined;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 pt-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <StatusBadge status={poll.status} />
          {poll.isCreator && poll.status === "active" && (
            <button
              onClick={handleEndPoll}
              disabled={ending}
              className="px-4 py-1.5 text-sm border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              {ending ? "Ending..." : "End Poll"}
            </button>
          )}
        </div>

        {/* Share link (creator only, active poll) */}
        {poll.isCreator && poll.status === "active" && (
          <ShareLink pollId={poll.id} />
        )}

        {/* Main content */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          {showJoin && (
            <JoinScreen
              pollId={poll.id}
              question={poll.question}
              onJoined={fetchPoll}
            />
          )}
          {showVote && (
            <VoteCard
              pollId={poll.id}
              question={poll.question}
              options={poll.options}
              onVoted={fetchPoll}
            />
          )}
          {showResults && (
            <ResultsView
              question={poll.question}
              options={poll.options}
              voteCounts={poll.voteCounts}
              totalVotes={poll.totalVotes}
            />
          )}
        </div>

        {/* Participants */}
        {poll.participants.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-400">
              Participants ({poll.participants.length})
            </h3>
            <ParticipantList participants={poll.participants} />
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify full flow**

```bash
cd ~/polling-app && npm run dev
```

Manual test:
1. Visit localhost:3000 → create a poll
2. Copy the share link → open in incognito
3. Join with a name → see vote card
4. Vote → see live results
5. Back in original tab → end poll
6. Open share link again in new incognito → see results directly (no join)

- [ ] **Step 3: Commit**

```bash
cd ~/polling-app && git add src/app/poll/ && git commit -m "feat: add poll page with join/vote/results state machine"
```

---

## Task 12: SSE Reconnection & Polish

**Files:**
- Modify: `src/app/poll/[id]/page.tsx`

- [ ] **Step 1: Improve SSE reconnection**

The SSE `onerror` handler in the poll page already does a delayed re-fetch. Enhance it to properly reconnect the EventSource as well. Update the `onerror` handler:

```tsx
eventSource.onerror = () => {
  eventSource.close();
  // Re-fetch full state and the useEffect will re-establish SSE
  setTimeout(() => {
    fetchPoll();
  }, 2000);
};
```

This already works because the `useEffect` depends on `poll?.status`, so after `fetchPoll` updates state, SSE reconnects if still active.

- [ ] **Step 2: Add participant vote status updates to SSE**

In the `vote_cast` SSE handler, also update participant `hasVoted` status. Modify the handler:

```tsx
eventSource.addEventListener("vote_cast", (e) => {
  const data = JSON.parse(e.data);
  setPoll((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      voteCounts: data.voteCounts,
      totalVotes: data.totalVotes,
    };
  });
});
```

Note: We already broadcast voteCounts. For participant hasVoted we'd need to include participantId in the broadcast — this is a nice-to-have but not critical since the participant list updates on re-fetch.

- [ ] **Step 3: Commit**

```bash
cd ~/polling-app && git add -A && git commit -m "fix: improve SSE reconnection behavior"
```

---

## Summary

| Task | What it builds | Estimated size |
|------|---------------|---------------|
| 1 | Project scaffold | Boilerplate |
| 2 | 20 SVG avatars | ~200 lines |
| 3 | In-memory store | ~100 lines |
| 4 | SSE manager | ~40 lines |
| 5 | All 6 API routes | ~200 lines |
| 6 | CreatePollForm + home | ~100 lines |
| 7 | StatusBadge, ShareLink, ParticipantList | ~80 lines |
| 8 | JoinScreen | ~60 lines |
| 9 | VoteCard | ~70 lines |
| 10 | ResultsView | ~50 lines |
| 11 | Poll page (state machine) | ~150 lines |
| 12 | SSE reconnection polish | ~20 lines |
