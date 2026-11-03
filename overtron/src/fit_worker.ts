// Chain worker for the page: TyMC's browser worker entry, with the Overtron's model
// loader (the model arrives as a JSON spec, src/fits.ts).

import { workers } from "tymc";
import { load_model } from "./fits.ts";

workers.browser_worker_entry(self as unknown as Parameters<typeof workers.browser_worker_entry>[0],
  load_model as Parameters<typeof workers.browser_worker_entry>[1]);
