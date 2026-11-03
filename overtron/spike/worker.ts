// Chain worker for Node: wires worker_threads to TyMC's browser worker entry.

import { parentPort } from "node:worker_threads";
import { workers } from "tymc";

const port = parentPort!;
const scope = {
  onmessage: null as ((event: { readonly data: unknown }) => void) | null,
  postMessage: (message: unknown, transfer?: ArrayBuffer[]) => port.postMessage(message, transfer),
};
workers.browser_worker_entry(scope);
port.on("message", (data) => scope.onmessage?.({ data }));
