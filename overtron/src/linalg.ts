// Symmetric eigendecomposition by the cyclic Jacobi method, for the RW2 bases
// (n up to about 130). TyMC has the same method internally, but not in its public API.

/** Eigenvalues (ascending) and eigenvectors (columns of an n x n row-major matrix) of a symmetric matrix. */
export function eigh(a: ArrayLike<number>, n: number): { values: Float64Array; vectors: Float64Array } {
  const A = Float64Array.from(a);
  const V = new Float64Array(n * n);
  for (let i = 0; i < n; i++) V[i * n + i] = 1;
  let scale = 0;
  for (let i = 0; i < n * n; i++) scale = Math.max(scale, Math.abs(A[i]));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off = Math.max(off, Math.abs(A[p * n + q]));
    if (off <= 1e-15 * scale) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = A[p * n + q];
        if (apq === 0) continue;
        // the rotation that zeros A[p, q] (Golub and Van Loan, section 8.5)
        const theta = (A[q * n + q] - A[p * n + p]) / (2 * apq);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k * n + p], akq = A[k * n + q];
          A[k * n + p] = c * akp - s * akq;
          A[k * n + q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p * n + k], aqk = A[q * n + k];
          A[p * n + k] = c * apk - s * aqk;
          A[q * n + k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k * n + p], vkq = V[k * n + q];
          V[k * n + p] = c * vkp - s * vkq;
          V[k * n + q] = s * vkp + c * vkq;
        }
      }
    }
  }
  const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => A[i * n + i] - A[j * n + j]);
  const values = Float64Array.from(order, (i) => A[i * n + i]);
  const vectors = new Float64Array(n * n);
  order.forEach((col, k) => {
    for (let i = 0; i < n; i++) vectors[i * n + k] = V[i * n + col];
  });
  return { values, vectors };
}
