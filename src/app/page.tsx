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
