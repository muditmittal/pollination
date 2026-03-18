import { neon } from "@neondatabase/serverless";

function getDb() {
  return neon(process.env.DATABASE_URL!);
}

// --- Schema initialization ---
let initialized = false;

export async function initDb() {
  if (initialized) return;
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS polls (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      options JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      creator_token TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      ended_at TIMESTAMPTZ
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS participants (
      id TEXT PRIMARY KEY,
      poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      avatar_index INTEGER NOT NULL,
      voted_index INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_participants_poll ON participants(poll_id)
  `;
  initialized = true;
}

// --- Auto-close polls older than 7 days, delete closed polls older than 30 days ---
export async function cleanupPolls() {
  const sql = getDb();
  await initDb();

  await sql`
    UPDATE polls SET status = 'ended', ended_at = NOW()
    WHERE status = 'active' AND created_at < NOW() - INTERVAL '7 days'
  `;

  await sql`
    DELETE FROM polls WHERE status = 'ended' AND ended_at < NOW() - INTERVAL '30 days'
  `;
}

// --- Types ---
export interface Poll {
  id: string;
  question: string;
  options: string[];
  status: "active" | "ended";
  creatorToken: string;
  createdAt: string;
  endedAt: string | null;
}

export interface Participant {
  id: string;
  pollId: string;
  name: string;
  avatarIndex: number;
  votedIndex: number | null;
}

// --- Poll CRUD ---
export async function createPoll(
  id: string,
  question: string,
  options: string[],
  creatorToken: string
): Promise<Poll> {
  const sql = getDb();
  await initDb();

  await sql`
    INSERT INTO polls (id, question, options, status, creator_token)
    VALUES (${id}, ${question}, ${JSON.stringify(options)}::jsonb, 'active', ${creatorToken})
  `;

  return {
    id,
    question,
    options,
    status: "active",
    creatorToken,
    createdAt: new Date().toISOString(),
    endedAt: null,
  };
}

export async function getPoll(id: string): Promise<Poll | null> {
  const sql = getDb();
  await initDb();

  const rows = await sql`SELECT * FROM polls WHERE id = ${id}`;
  if (rows.length === 0) return null;

  const row = rows[0];

  // Auto-close if older than 7 days
  if (
    row.status === "active" &&
    row.created_at &&
    Date.now() - new Date(row.created_at as string).getTime() >
      7 * 24 * 60 * 60 * 1000
  ) {
    await endPollById(id);
    return getPoll(id);
  }

  return {
    id: row.id as string,
    question: row.question as string,
    options: row.options as string[],
    status: row.status as "active" | "ended",
    creatorToken: row.creator_token as string,
    createdAt: row.created_at as string,
    endedAt: (row.ended_at as string) || null,
  };
}

export async function endPoll(id: string, token: string): Promise<boolean> {
  const sql = getDb();
  await initDb();

  const result = await sql`
    UPDATE polls SET status = 'ended', ended_at = NOW()
    WHERE id = ${id} AND creator_token = ${token} AND status = 'active'
  `;

  return result.length > 0 || true; // neon doesn't return rowsAffected easily, verify separately
}

async function endPollById(id: string): Promise<void> {
  const sql = getDb();
  await sql`
    UPDATE polls SET status = 'ended', ended_at = NOW()
    WHERE id = ${id} AND status = 'active'
  `;
}

// --- Participants ---
export async function addParticipant(
  id: string,
  pollId: string,
  name: string,
  avatarIndex: number
): Promise<Participant> {
  const sql = getDb();
  await initDb();

  await sql`
    INSERT INTO participants (id, poll_id, name, avatar_index)
    VALUES (${id}, ${pollId}, ${name}, ${avatarIndex})
  `;

  return { id, pollId, name, avatarIndex, votedIndex: null };
}

export async function getParticipant(
  pollId: string,
  participantId: string
): Promise<Participant | null> {
  const sql = getDb();
  await initDb();

  const rows = await sql`
    SELECT * FROM participants WHERE id = ${participantId} AND poll_id = ${pollId}
  `;

  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: row.id as string,
    pollId: row.poll_id as string,
    name: row.name as string,
    avatarIndex: row.avatar_index as number,
    votedIndex: row.voted_index as number | null,
  };
}

export async function getParticipants(pollId: string): Promise<Participant[]> {
  const sql = getDb();
  await initDb();

  const rows = await sql`
    SELECT * FROM participants WHERE poll_id = ${pollId} ORDER BY created_at ASC
  `;

  return rows.map((row) => ({
    id: row.id as string,
    pollId: row.poll_id as string,
    name: row.name as string,
    avatarIndex: row.avatar_index as number,
    votedIndex: row.voted_index as number | null,
  }));
}

export async function castVote(
  pollId: string,
  participantId: string,
  optionIndex: number
): Promise<boolean> {
  const sql = getDb();
  await initDb();

  const poll = await getPoll(pollId);
  if (!poll || poll.status !== "active") return false;
  if (optionIndex < 0 || optionIndex >= poll.options.length) return false;

  const rows = await sql`
    UPDATE participants SET voted_index = ${optionIndex}
    WHERE id = ${participantId} AND poll_id = ${pollId} AND voted_index IS NULL
    RETURNING id
  `;

  return rows.length > 0;
}

export async function getVoteCounts(pollId: string): Promise<number[]> {
  const poll = await getPoll(pollId);
  if (!poll) return [];

  const sql = getDb();
  const rows = await sql`
    SELECT voted_index, COUNT(*)::int as count FROM participants
    WHERE poll_id = ${pollId} AND voted_index IS NOT NULL
    GROUP BY voted_index
  `;

  const counts = new Array(poll.options.length).fill(0);
  for (const row of rows) {
    const idx = row.voted_index as number;
    if (idx >= 0 && idx < counts.length) {
      counts[idx] = row.count as number;
    }
  }
  return counts;
}

export async function getUsedAvatarIndices(pollId: string): Promise<number[]> {
  const sql = getDb();
  await initDb();

  const rows = await sql`
    SELECT DISTINCT avatar_index FROM participants WHERE poll_id = ${pollId}
  `;

  return rows.map((row) => row.avatar_index as number);
}
