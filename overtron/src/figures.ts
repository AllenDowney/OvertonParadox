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
