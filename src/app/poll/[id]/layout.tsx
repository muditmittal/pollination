import type { Metadata } from "next";
import { getPoll } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const poll = await getPoll(id);

  if (!poll) {
    return { title: "Poll not found — Pollination" };
  }

  const title = poll.question;
  const description = `Vote: ${poll.options.join(" · ")}`;
  const ogImageUrl = `/api/og/${id}`;

  return {
    title: `${title} — Pollination`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function PollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
