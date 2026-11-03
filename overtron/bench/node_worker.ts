// Chain worker for Node: wires worker_threads to TyMC's browser worker entry,
// with the Overtron's model loader (src/fits.ts).

import { parentPort } from "node:worker_threads";
import { workers } from "tymc";
import { load_model } from "../src/fits.ts";

const port = parentPort!;
const scope = {
  onmessage: null as ((event: { readonly data: unknown }) => void) | null,
  postMessage: (message: unknown, transfer?: ArrayBuffer[]) => port.postMessage(message, transfer),
};
workers.browser_worker_entry(scope, load_model as Parameters<typeof workers.browser_worker_entry>[1]);
port.on("message", (data) => scope.onmessage?.({ data }));
