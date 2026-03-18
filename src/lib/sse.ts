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
