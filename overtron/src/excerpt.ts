// The data excerpt (overton/excerpt.py): a little-endian column store, gzipped.
// Columns, dtypes and byte offsets come from the manifest; each column is 4-byte
// aligned, so the typed arrays view the buffer in place.

export type Column = Int8Array | Uint8Array | Int16Array | Float32Array;

export interface ColumnSpec {
  readonly name: string;
  readonly dtype: "int8" | "uint8" | "int16" | "float32";
  readonly offset: number;
  readonly length: number;
}

export interface Manifest {
  readonly version: string;
  readonly rows: number;
  readonly columns: readonly ColumnSpec[];
  readonly bytes: number;
  readonly citation: string;
  readonly [key: string]: unknown;
}

export interface Question {
  readonly description: string;
  readonly question: string;
  readonly value_labels: Record<string, string>;
  readonly conservative: readonly number[];
  readonly rank: number;
  readonly domain: string;
  readonly topic: string;
  readonly in_primary: boolean;
  readonly excluded_because: readonly string[];
  readonly [key: string]: unknown;
}

export interface QuestionTable {
  readonly questions: Record<string, Question>;
  readonly presets: Record<string, readonly string[]>;
  readonly book_codes: Record<string, readonly number[]>;
}

export type Excerpt = { readonly rows: number } & Record<string, Column>;

const ARRAYS = { int8: Int8Array, uint8: Uint8Array, int16: Int16Array, float32: Float32Array };

/** Views of each column in the uncompressed buffer. Missing values: -1 in integer columns, NaN in floats. */
export function decode(raw: ArrayBuffer, manifest: Manifest): Excerpt {
  if (raw.byteLength !== manifest.bytes) throw new Error(`excerpt: ${raw.byteLength} bytes, manifest says ${manifest.bytes}`);
  const out: Record<string, Column | number> = { rows: manifest.rows };
  for (const c of manifest.columns) out[c.name] = new ARRAYS[c.dtype](raw, c.offset, c.length);
  return out as Excerpt;
}

/** Fetch and decode the excerpt in the browser (DecompressionStream). */
export async function load(base: string): Promise<{ excerpt: Excerpt; manifest: Manifest; questions: QuestionTable }> {
  const [manifest, questions] = await Promise.all([
    fetch(`${base}/manifest.json`).then((r) => r.json() as Promise<Manifest>),
    fetch(`${base}/questions.json`).then((r) => r.json() as Promise<QuestionTable>),
  ]);
  const response = await fetch(`${base}/respondents.bin.gz`);
  if (!response.ok) throw new Error(`respondents.bin.gz: HTTP ${response.status}`);
  let raw = await response.arrayBuffer();
  // some servers send .gz files with Content-Encoding: gzip, and the browser has already
  // decompressed them; others send the gzip bytes as is (magic number 1f 8b)
  const head = new Uint8Array(raw, 0, 2);
  if (head[0] === 0x1f && head[1] === 0x8b) {
    const stream = new Blob([raw]).stream().pipeThrough(new DecompressionStream("gzip"));
    raw = await new Response(stream).arrayBuffer();
  }
  return { excerpt: decode(raw, manifest), manifest, questions };
}
