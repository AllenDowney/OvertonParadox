// The Overtron's figures, as SVG. Colors: post 1's ideology colors (overton/apc_figures.py,
// GROUP_COLORS), kept for consistency with the post (Allen, 2026-11-03). The blue-purple pair
// is below the palette validator's normal-vision floor (Delta E 11), so every mark in these
// colors is labeled directly and identity never rests on color alone. (#9b4f9f is the nearest
// purple that passes, if a figure can't label its marks.)

import type { Headline } from "./position.ts";

export const COLORS = { Liberal: "#4878d0", Moderate: "#956cb4", Conservative: "#d65f5f" } as const;

const SVG = "http://www.w3.org/2000/svg";

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent?: Element) {
  const node = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  parent?.appendChild(node);
  return node;
}

const ordinal = (x: number) => {
  const n = Math.round(x);
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] ?? "th";
  return `${n}${suffix}`;
};

/** A figure's header, as in the book's style: a bold title and a muted subtitle, left-aligned with the plot. */
function header(container: HTMLElement, title: string, subtitle: string, indent: number) {
  const head = document.createElement("div");
  head.className = "figure-header";
  head.style.paddingLeft = `${indent}px`;
  const t = document.createElement("div");
  t.className = "figure-title";
  t.textContent = title;
  const s = document.createElement("div");
  s.className = "figure-subtitle";
  s.textContent = subtitle;
  head.append(t, s);
  container.appendChild(head);
}

/** A tooltip shared by a figure's marks: shown on hover and on keyboard focus. */
function tooltip(container: HTMLElement) {
  const tip = document.createElement("div");
  tip.className = "tooltip";
  tip.hidden = true;
  container.appendChild(tip);
  return (mark: SVGElement, html: string) => {
    mark.setAttribute("tabindex", "0");
    const show = (x: number, y: number) => {
      tip.innerHTML = html;
      tip.hidden = false;
      const box = container.getBoundingClientRect();
      tip.style.left = `${Math.min(Math.max(x - box.left + 12, 0), box.width - tip.offsetWidth)}px`;
      tip.style.top = `${y - box.top - tip.offsetHeight - 10}px`;
    };
    mark.addEventListener("pointermove", (e) => show(e.clientX, e.clientY));
    mark.addEventListener("pointerleave", () => (tip.hidden = true));
    mark.addEventListener("focus", () => {
      const r = mark.getBoundingClientRect();
      show(r.left + r.width / 2, r.top);
    });
    mark.addEventListener("blur", () => (tip.hidden = true));
  };
}

/**
 * The conservatism line: the 2024 distribution of conservatism as percentiles (0-100), with
 * the 2024 medians of liberals, moderates, and conservatives (circles, above the line) and the
 * median 1974 liberal (triangle, below), each with its 90% bootstrap interval.
 */
export function conservatism_line(container: HTMLElement, h: Headline, last_year = 2024) {
  redraw_on_resize(container, () => draw_conservatism_line(container, h, last_year));
}

/** Draw at the container's pixel width, so text stays at its CSS size on a phone; redraw when it changes. */
function redraw_on_resize(container: HTMLElement & { _observer?: ResizeObserver }, draw: () => void) {
  container._observer?.disconnect();
  let width = 0;
  container._observer = new ResizeObserver(() => {
    if (Math.abs(container.clientWidth - width) < 1) return;
    width = container.clientWidth;
    draw();
  });
  container._observer.observe(container);
  draw();
}

function draw_conservatism_line(container: HTMLElement, h: Headline, last_year: number) {
  container.replaceChildren();
  container.classList.add("figure");
  const W = Math.max(320, Math.round(container.clientWidth || 800)), left = 20, right = 20;
  const narrow = W < 560;
  const x = (p: number) => left + (p / 100) * (W - left - right);
  // the 2024 group medians' labels go in one row, staggered to a second when two are close;
  // room above the axis only for the rows used
  const groups = (["Liberal", "Moderate", "Conservative"] as const).map((g) => ({ g, key: g.toLowerCase() as "liberal" }));
  const label_row: number[] = [];
  groups.forEach(({ key }, k) => {
    const close = k > 0 && x(h[key]) - x(h[groups[k - 1].key]) < (narrow ? 100 : 130);
    label_row.push(close ? 1 - label_row[k - 1] : 0);
  });
  const axis = 56 + 16 * Math.max(...label_row), H = axis + 100;
  // the result as the title, the axis as the subtitle, left-aligned as in the book's figures
  const share = h.ref_liberal >= 50 ? Math.round(h.ref_liberal) : Math.round(100 - h.ref_liberal);
  const side = h.ref_liberal >= 50 ? "more conservative" : "more liberal";
  header(container, `The median ${h.ref_year} liberal would be ${side} than ${share}% of people in ${last_year}`,
    `Percentile of the ${last_year} distribution of conservatism: group medians with 90% intervals`, left);
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img",
    "aria-label": `Conservatism line: the median ${h.ref_year} liberal at the ${ordinal(h.ref_liberal)} percentile of ${last_year}` });
  container.appendChild(svg);
  const hover = tooltip(container);

  // axis: a recessive rule with ticks every 25 percentiles
  el("line", { x1: x(0), x2: x(100), y1: axis, y2: axis, class: "axis" }, svg);
  for (const p of [0, 25, 50, 75, 100]) {
    el("line", { x1: x(p), x2: x(p), y1: axis - 4, y2: axis + 4, class: "axis" }, svg);
    el("text", { x: x(p), y: axis + 18, class: "tick", "text-anchor": "middle" }, svg).textContent = String(p);
  }
  el("text", { x: x(0), y: H - 6, class: "muted-text", "text-anchor": "start" }, svg).textContent = "← more liberal";
  el("text", { x: x(100), y: H - 6, class: "muted-text", "text-anchor": "end" }, svg).textContent = "more conservative →";

  // the 2024 group medians, above the line
  for (const [k, { g, key }] of groups.entries()) {
    const p = h[key], lo = h[`${key}_lo90`], hi = h[`${key}_hi90`];
    const y = axis - 22;
    el("line", { x1: x(lo), x2: x(hi), y1: y, y2: y, stroke: COLORS[g], class: "interval" }, svg);
    const dot = el("circle", { cx: x(p), cy: y, r: 6, fill: COLORS[g], class: "mark" }, svg);
    el("text", { x: x(p), y: y - 14 - 16 * label_row[k], class: "label", "text-anchor": "middle" }, svg).textContent =
      narrow ? `${g.toLowerCase()}s` : `${last_year} ${g.toLowerCase()}s`;
    hover(dot, `<b>${last_year} ${g.toLowerCase()}s</b>, median: ${ordinal(p)} percentile<br>90% interval ${lo.toFixed(1)}–${hi.toFixed(1)}`);
  }

  // the median 1974 liberal, below the line: a triangle pointing up at its position
  const p = h.ref_liberal, lo = h.ref_liberal_lo90, hi = h.ref_liberal_hi90, y = axis + 34;
  el("line", { x1: x(lo), x2: x(hi), y1: y, y2: y, stroke: COLORS.Liberal, class: "interval" }, svg);
  const tri = el("path", { d: `M ${x(p)} ${y - 8} L ${x(p) + 8} ${y + 6} L ${x(p) - 8} ${y + 6} Z`,
    fill: COLORS.Liberal, class: "mark" }, svg);
  // label centered under the triangle, kept inside the plot
  const text = narrow ? `${h.ref_year} liberal: ${ordinal(p)}` : `median ${h.ref_year} liberal: ${ordinal(p)} percentile`;
  const half = text.length * (narrow ? 3.6 : 3.9);
  el("text", { x: Math.min(Math.max(x(p), left + half), W - right - half), y: y + 26, class: "label",
    "text-anchor": "middle" }, svg).textContent = text;
  hover(tri, `<b>Median ${h.ref_year} liberal</b>, placed in the ${last_year} distribution: ${ordinal(p)} percentile` +
    `<br>90% interval ${lo.toFixed(1)}–${hi.toFixed(1)}<br>${h.ref_liberal_percent.toFixed(1)}% conservative responses`);


  // the same numbers as a table
  const details = document.createElement("details");
  const rows = [
    [`Median ${h.ref_year} liberal`, "ref_liberal"], [`${last_year} liberals`, "liberal"],
    [`${last_year} moderates`, "moderate"], [`${last_year} conservatives`, "conservative"],
  ] as const;
  details.innerHTML = `<summary>Table</summary><table><thead><tr><th></th><th>Percentile of ${last_year}</th>` +
    `<th>90% interval</th></tr></thead><tbody>${rows.map(([label, key]) =>
      `<tr><td>${label}</td><td>${h[key].toFixed(1)}</td><td>${h[`${key}_lo90`].toFixed(1)}–${h[`${key}_hi90`].toFixed(1)}</td></tr>`).join("")}` +
    `</tbody></table>`;
  container.appendChild(details);
}

export interface Series {
  readonly label: string;
  readonly color: string;
  readonly x: readonly number[];
  readonly mean: readonly number[];
  readonly lo?: readonly number[]; // band (84% in post 1's figures)
  readonly hi?: readonly number[];
  readonly dotted?: boolean;
  readonly width?: number;
  readonly label_at?: "start" | "end" | null; // where the direct label goes; null for none
  readonly plate?: boolean; // label on a background plate (trajectories)
}

export interface LineChartOptions {
  readonly title: string;
  readonly subtitle?: string;
  readonly kind: string; // the figure type, right-aligned in the header, as in the book's figures
  readonly xlabel: string;
  readonly xdomain?: readonly [number, number]; // default: the data's range (labels go in the margins)
  readonly ydomain: readonly [number, number];
  readonly xstep: number;
  readonly series: readonly Series[];
  readonly hover?: "all" | "nearest"; // the tooltip lists every series at x, or only the nearest line
}

/** Lines with bands over a continuous x, labeled directly, in the book's style. */
export function line_chart(container: HTMLElement, options: LineChartOptions) {
  redraw_on_resize(container, () => draw_line_chart(container, options));
}

/** Spread labels apart vertically (min gap), keeping their order: a few passes of pairwise pushes. */
function spread(ys: number[], gap: number, lo: number, hi: number): number[] {
  const order = ys.map((y, i) => [y, i] as const).sort((a, b) => a[0] - b[0]).map(([, i]) => i);
  const out = [...ys];
  for (let pass = 0; pass < 50; pass++) {
    let moved = false;
    for (let k = 1; k < order.length; k++) {
      const a = order[k - 1], b = order[k];
      const overlap = gap - (out[b] - out[a]);
      if (overlap > 0.01) {
        out[a] -= overlap / 2;
        out[b] += overlap / 2;
        moved = true;
      }
    }
    for (const i of order) out[i] = Math.min(Math.max(out[i], lo), hi);
    if (!moved) break;
  }
  return out;
}

function draw_line_chart(container: HTMLElement, options: LineChartOptions) {
  const all_x = options.series.flatMap((s) => s.x);
  const o = { ...options, xdomain: options.xdomain ?? [Math.min(...all_x), Math.max(...all_x)] as const };
  container.replaceChildren();
  container.classList.add("figure");
  const W = Math.max(320, Math.round(container.clientWidth || 800));
  const narrow = W < 560;
  const H = Math.round(Math.min(Math.max(W * 0.55, 280), 440));
  // room at the right for the longest label at a line's end
  const end_chars = Math.max(0, ...o.series.filter((s) => s.label_at === "end").map((s) => s.label.length));
  const m = { left: 34, right: end_chars ? end_chars * 8 + 12 : 12, top: 10, bottom: 44 };
  const x = (v: number) => m.left + ((v - o.xdomain[0]) / (o.xdomain[1] - o.xdomain[0])) * (W - m.left - m.right);
  const y = (v: number) => m.top + (1 - (v - o.ydomain[0]) / (o.ydomain[1] - o.ydomain[0])) * (H - m.top - m.bottom);
  const head = header_split(container, o.title, o.subtitle ?? "Percent conservative responses", narrow ? "" : o.kind, m.left);
  void head;
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": o.title });
  container.appendChild(svg);
  const clip = `clip-${Math.random().toString(36).slice(2)}`;
  const defs = el("defs", {}, svg);
  el("rect", { x: m.left, y: m.top, width: W - m.left - m.right, height: H - m.top - m.bottom },
    el("clipPath", { id: clip }, defs));

  // grid and axes: recessive
  for (let v = o.ydomain[0]; v <= o.ydomain[1] + 1e-9; v += 10) {
    el("line", { x1: m.left, x2: W - m.right, y1: y(v), y2: y(v), class: "grid" }, svg);
    el("text", { x: m.left - 6, y: y(v) + 4, class: "tick", "text-anchor": "end" }, svg).textContent = String(v);
  }
  const first_tick = Math.ceil(o.xdomain[0] / o.xstep) * o.xstep;
  const step = narrow && (o.xdomain[1] - o.xdomain[0]) / o.xstep > 6 ? 2 * o.xstep : o.xstep;
  for (let v = first_tick; v <= o.xdomain[1]; v += step) {
    el("line", { x1: x(v), x2: x(v), y1: m.top, y2: H - m.bottom, class: "grid" }, svg);
    el("text", { x: x(v), y: H - m.bottom + 18, class: "tick", "text-anchor": "middle" }, svg).textContent = String(v);
  }
  el("text", { x: (m.left + W - m.right) / 2, y: H - 6, class: "axis-label", "text-anchor": "middle" }, svg).textContent = o.xlabel;

  // bands, then lines, clipped to the plot
  const plot = el("g", { "clip-path": `url(#${clip})` }, svg);
  const path = (xs: readonly number[], ys: readonly number[]) => xs.map((v, i) => `${i ? "L" : "M"}${x(v)},${y(ys[i])}`).join("");
  for (const s of o.series) {
    if (!s.lo || !s.hi) continue;
    const d = path(s.x, s.hi) + [...s.x].reverse().map((v, i) => `L${x(v)},${y(s.lo![s.x.length - 1 - i])}`).join("") + "Z";
    el("path", { d, style: `fill:${s.color}`, class: "band" }, plot);
  }
  for (const s of o.series)
    el("path", { d: path(s.x, s.mean), style: `stroke:${s.color}`, class: s.dotted ? "line dotted" : "line",
      "stroke-width": s.width ?? 2.5 }, plot);

  // direct labels at the line ends, spread apart so they don't collide
  for (const side of ["start", "end"] as const) {
    const labeled = o.series.filter((s) => s.label_at === side && s.x.length > 0);
    const k = (s: Series) => (side === "start" ? 0 : s.x.length - 1);
    const ys = spread(labeled.map((s) => y(s.mean[k(s)])), 15, m.top + 6, H - m.bottom - 2);
    labeled.forEach((s, i) => {
      const px = x(s.x[k(s)]) + (side === "start" ? -5 : 5);
      const anchor = side === "start" ? "end" : "start";
      if (s.plate) {
        const w = s.label.length * 7 + 6;
        el("rect", { x: anchor === "end" ? px - w + 2 : px - 2, y: ys[i] - 8, width: w, height: 15, rx: 3, class: "plate" }, svg);
      }
      el("text", { x: px, y: ys[i] + 4, class: s.plate ? "label small" : "label", "text-anchor": anchor }, svg).textContent = s.label;
    });
  }

  // hover: a crosshair at the nearest x, and the values there
  const tip = document.createElement("div");
  tip.className = "tooltip";
  tip.hidden = true;
  container.appendChild(tip);
  const cross = el("line", { y1: m.top, y2: H - m.bottom, class: "crosshair", visibility: "hidden" }, svg);
  const overlay = el("rect", { x: m.left, y: m.top, width: W - m.left - m.right, height: H - m.top - m.bottom,
    fill: "transparent", "pointer-events": "all", tabindex: 0 }, svg);
  const xs = [...new Set(o.series.flatMap((s) => s.x))].sort((a, b) => a - b);
  const show = (px: number, py: number, cx: number, cy: number) => {
    const xv = xs.reduce((best, v) => (Math.abs(x(v) - px) < Math.abs(x(best) - px) ? v : best), xs[0]);
    let rows = o.series.map((s) => {
      const i = s.x.indexOf(xv);
      return i < 0 ? null : { s, v: s.mean[i], lo: s.lo?.[i], hi: s.hi?.[i] };
    }).filter((r): r is NonNullable<typeof r> => r !== null);
    if (o.hover === "nearest") rows = rows.sort((a, b) => Math.abs(y(a.v) - py) - Math.abs(y(b.v) - py)).slice(0, 1);
    else rows.sort((a, b) => b.v - a.v);
    if (!rows.length) return;
    cross.setAttribute("x1", String(x(xv)));
    cross.setAttribute("x2", String(x(xv)));
    cross.setAttribute("visibility", "visible");
    tip.innerHTML = `<b>${o.xlabel} ${xv}</b>` + rows.map((r) =>
      `<div><span class="swatch" style="background:${r.s.color}"></span>${r.s.label || "all"}: ${r.v.toFixed(1)}` +
      (r.lo !== undefined && r.hi !== undefined ? ` <span class="muted">[${r.lo.toFixed(1)}, ${r.hi.toFixed(1)}]</span>` : "") + "</div>").join("");
    tip.hidden = false;
    const box = container.getBoundingClientRect();
    const left = cx - box.left + 14;
    tip.style.left = `${left + tip.offsetWidth > box.width ? cx - box.left - tip.offsetWidth - 14 : left}px`;
    tip.style.top = `${Math.max(cy - box.top - tip.offsetHeight / 2, 0)}px`;
  };
  overlay.addEventListener("pointermove", (e) => {
    const r = svg.getBoundingClientRect();
    const scale = W / r.width;
    show((e.clientX - r.left) * scale, (e.clientY - r.top) * scale, e.clientX, e.clientY);
  });
  overlay.addEventListener("pointerleave", () => {
    tip.hidden = true;
    cross.setAttribute("visibility", "hidden");
  });
}

/** The book's header with the figure type right-aligned on the title row. */
function header_split(container: HTMLElement, title: string, subtitle: string, kind: string, indent: number) {
  header(container, title, subtitle, indent);
  if (!kind) return;
  const head = container.querySelector(".figure-header") as HTMLElement;
  const right = document.createElement("div");
  right.className = "figure-kind";
  right.innerHTML = `${kind}<br>GSS`;
  head.appendChild(right);
}
