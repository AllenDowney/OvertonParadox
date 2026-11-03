// Post 1's colormaps (overton/apc_figures.py): survey decades warm (gold to wine), decades of
// birth and birth years viridis (yellow, earliest, to purple, latest). Lines in these colors
// are always labeled directly: six- and eleven-step ramps can't reach full separation.

// matplotlib's viridis, 33 samples (interpolated between them)
const VIRIDIS = ["#440154", "#470d60", "#48186a", "#482374", "#472d7b", "#453781", "#424086", "#3e4989", "#3b528b",
  "#375b8d", "#33638d", "#2f6b8e", "#2c728e", "#297a8e", "#26828e", "#23898e", "#21918c", "#1f988b", "#1fa088",
  "#22a785", "#28ae80", "#32b67a", "#3fbc73", "#4ec36b", "#5ec962", "#70cf57", "#84d44b", "#98d83e", "#addc30",
  "#c2df23", "#d8e219", "#ece51b", "#fde725"];

// SURVEY_CMAP, a LinearSegmentedColormap through these anchors
const SURVEY = ["#ebb840", "#e08a33", "#cc5e33", "#ab3d3d", "#86294a", "#5e1f4a"];

const rgb = (hex: string) => [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16));

/** Linear interpolation through evenly spaced anchors, as matplotlib's LinearSegmentedColormap.from_list does. */
function ramp(anchors: readonly string[], t: number): string {
  const u = Math.min(Math.max(t, 0), 1) * (anchors.length - 1);
  const k = Math.min(Math.floor(u), anchors.length - 2);
  const a = rgb(anchors[k]), b = rgb(anchors[k + 1]);
  const f = u - k;
  return `rgb(${a.map((v, i) => Math.round(v + f * (b[i] - v))).join(",")})`;
}

export const viridis = (t: number) => ramp(VIRIDIS, t);
export const survey_decade = (t: number) => ramp(SURVEY, t);

/** Decades of birth and birth years: viridis(0.9 * (1 - frac)), earliest yellow-green, latest purple. */
export const birth_color = (frac: number) => viridis(0.9 * (1 - frac));
