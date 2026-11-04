"""Figure helpers frozen from CultureWar (commit a7617b7): notebooks/utils.py and
two label helpers from notebooks/composed_standardized_effects/effects.py.

Only the functions and settings that overton/apc_figures.py uses, and the ones
they call, in their original order. Copied rather than imported so this repo
doesn't depend on ~/CultureWar (decision, 2026-11-01); it won't follow later
changes to that book's style.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Sequence

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.colors import to_hex, to_rgb


FACET_LABEL_TIME_SERIES = "Time series"


FACET_LABEL_COHORT_SERIES = "Cohort series"


FACET_LABEL_PERIOD_EFFECT = "Period component"


FACET_LABEL_COHORT_EFFECT = "Cohort component"


FACET_LABEL_COHORT_OVER_SURVEY_YEARS = "Cohort trajectories"


FIGURE_LINEWIDTH = 1.0


DIRECT_LABEL_GAP_PT = 3.0


def underride(d, **options):
    """Add key-value pairs to d only if key is not in d.

    d: dictionary
    options: keyword args to add to d
    """
    for key, val in options.items():
        d.setdefault(key, val)

    return d


def apply_figure_style() -> None:
    """Apply matplotlib rcParams for book/print figures (Task 114).

    Call once before ``plt.subplots()`` in pipeline scripts. Sets typography sized for
    ``FIGURE_FIGSIZE`` (nominal text block minus ragged-right inset). Standalone figure scripts must call
    this explicitly; ``time_model`` and other pipelines call it at figure creation.
    """
    from model_utils import configure_plot_style

    configure_plot_style()
    plt.rcParams.update(FIGURE_RCPARAMS)


FIGURE_FONT_FAMILY = "Roboto"


FIGURE_FONT_SANS_SERIF = ["Roboto", "DejaVu Sans", "Arial", "Helvetica", "sans-serif"]


FIGURE_FONT_SCALE = 1.1


def _figure_font_pt(base_pt: float) -> float:
    return round(base_pt * FIGURE_FONT_SCALE, 2)


FIGURE_TITLE_FONTSIZE = _figure_font_pt(7)


FIGURE_SOCIAL_BRAND_FONTSIZE = _figure_font_pt(6)


FIGURE_RCPARAMS: dict[str, float | str | list[str]] = {
    "font.family": FIGURE_FONT_FAMILY,
    "font.sans-serif": FIGURE_FONT_SANS_SERIF,
    "font.size": _figure_font_pt(7),
    "axes.titlesize": _figure_font_pt(7),
    "axes.labelsize": _figure_font_pt(7),
    "xtick.labelsize": _figure_font_pt(6.5),
    "ytick.labelsize": _figure_font_pt(6.5),
    "legend.fontsize": _figure_font_pt(6.5),
    "axes.titlelocation": "left",
    "axes.titleweight": "bold",
    "lines.linewidth": 1.0,  # was matplotlib default 1.5 (time-series mean line)
    "lines.markeredgewidth": 0,
    "scatter.edgecolors": "none",
    "grid.linewidth": 0.4,  # half matplotlib default (0.8)
    "axes.labelpad": 0.0,  # pull x-label closer to axis (default 4.0)
}


BOOK_PRINT_PAGE_WIDTH_IN = 6.0


BOOK_PRINT_INNER_MARGIN_IN = 0.9


BOOK_PRINT_OUTER_MARGIN_IN = 0.5


BOOK_PRINT_TEXT_WIDTH_IN = BOOK_PRINT_PAGE_WIDTH_IN - BOOK_PRINT_INNER_MARGIN_IN - BOOK_PRINT_OUTER_MARGIN_IN


FIGURE_RAGGED_RIGHT_INSET_IN = 0.25


FIGURE_TEXT_WIDTH_IN = BOOK_PRINT_TEXT_WIDTH_IN - FIGURE_RAGGED_RIGHT_INSET_IN


FIGURE_ASPECT_WIDTH_TO_HEIGHT = 2.3  # width : height (tune after print proofs)


FIGURE_FIGSIZE = (
    FIGURE_TEXT_WIDTH_IN,
    FIGURE_TEXT_WIDTH_IN / FIGURE_ASPECT_WIDTH_TO_HEIGHT,
)


FIGURE_DPI = 300


FIGURE_DPI_SOCIAL = 300


BOOK_LANDING_SHORT_URL = "allendowney.com/ywcn"


FIGURE_SOCIAL_BRAND_COLOR = "0.4"


FIGURE_COLOR_TIME_SERIES = "#1F3B73"  # navy


FIGURE_COLOR_PERIOD = "#145A5A"  # dark teal


FIGURE_COLOR_COHORT = "#7A1E3C"  # wine


FIGURE_HEADER_TEXT_COLOR = "0.2"  # same as the subtitle / source text


FIGURE_REG_MARK_COLOR = "0.5"  # medium gray, every figure


FIGURE_COLOR_TRAJECTORY = FIGURE_COLOR_TIME_SERIES


FIGURE_GRID_ALPHA = 0.3


def apply_book_grid(ax, *, alpha: float | None = None) -> None:
    """Major horizontal and vertical grid lines (Task 114 book style)."""
    ax.grid(
        True,
        which="major",
        axis="both",
        alpha=FIGURE_GRID_ALPHA if alpha is None else alpha,
    )


FIG_HEADER_TITLE_PAD_PT = 15


FIG_HEADER_SUBTITLE_Y = 1.0


FIG_SUBTITLE_LINESPACING = 1.5


FIGURE_REG_MARK_H_IN = 0.35


FIGURE_REG_MARK_V_IN = 0.08


FIGURE_REG_MARK_LINEWIDTH = 0.6


FIGURE_REG_MARK_BOTTOM_PAD_IN = 0.01


FIGURE_SAVE_PAD_TOP_INCHES = 0.1


FIGURE_SAVE_PAD_BOTTOM_INCHES = 0.04  # tighter below x-label


FIGURE_SAVE_PAD_INCHES = FIGURE_SAVE_PAD_TOP_INCHES  # legacy alias (symmetric fallback)


FIGURE_SAVE_PAD_LEFT_RIGHT_INCHES = 0.0


FIGURE_ALIGN_LEFT_IN = 0.0


FIGURE_ALIGN_TOL_IN = 0.005


FIGURE_TARGET_WIDTH_IN = FIGURE_FIGSIZE[0]


FIGURE_WIDTH_TOL_IN = 0.12  # ~3% of 4.35 in; layout target, not exact force


def _bbox_inches(artist, renderer, fig):
    """Artist window extent → inches in the figure's dpi_scale_trans."""
    return artist.get_window_extent(renderer=renderer).transformed(fig.dpi_scale_trans.inverted())


def leftmost_y_tick_label_x_inches(ax, renderer) -> float | None:
    """Leftmost ink of visible y-tick labels, in figure inches; None if no labels."""
    fig = ax.figure
    xs: list[float] = []
    for lab in ax.get_yticklabels():
        if (not lab.get_visible()) or (not str(lab.get_text()).strip()):
            continue
        xs.append(float(_bbox_inches(lab, renderer, fig).x0))
    if not xs:
        return None
    return min(xs)


def axes_left_x_inches(ax, renderer) -> float:
    """Axes patch left edge in figure inches."""
    return float(_bbox_inches(ax.patch, renderer, ax.figure).x0)


def _pin_y_tick_labels_to_left(
    fig,
    ax,
    *,
    left_edge_in: float,
    tol_in: float,
) -> None:
    """Shift axes horizontally so leftmost y-tick ink sits on ``left_edge_in``."""
    fig.canvas.draw()
    renderer = fig.canvas.get_renderer()
    for _ in range(4):
        tick_left = leftmost_y_tick_label_x_inches(ax, renderer)
        if tick_left is None:
            return
        shift = left_edge_in - tick_left
        if abs(shift) < tol_in:
            return
        fig_w = float(fig.get_size_inches()[0])
        pos = ax.get_position()
        ax.set_position([pos.x0 + shift / fig_w, pos.y0, pos.width, pos.height])
        fig.canvas.draw()
        renderer = fig.canvas.get_renderer()


def _fill_axes_to_target_width(
    fig,
    ax,
    *,
    left_edge_in: float,
    target_width_in: float,
    tol_in: float,
) -> None:
    """Widen/narrow axes so content ink right ≈ ``left_edge_in + target_width_in``."""
    target_right = left_edge_in + target_width_in
    for _ in range(6):
        _pin_y_tick_labels_to_left(fig, ax, left_edge_in=left_edge_in, tol_in=FIGURE_ALIGN_TOL_IN)
        fig.canvas.draw()
        renderer = fig.canvas.get_renderer()
        ink = fig.get_tightbbox(renderer)
        if ink is None:
            return
        delta = target_right - float(ink.x1)
        if abs(delta) < tol_in:
            return
        fig_w = float(fig.get_size_inches()[0])
        pos = ax.get_position()
        new_width = pos.width + delta / fig_w
        if new_width < 0.05:
            return
        ax.set_position([pos.x0, pos.y0, new_width, pos.height])


def apply_book_left_alignment(
    fig=None,
    ax=None,
    *,
    left_edge_in: float = FIGURE_ALIGN_LEFT_IN,
    tol_in: float = FIGURE_ALIGN_TOL_IN,
    fill_width: bool = True,
    target_width_in: float | None = None,
    width_tol_in: float = FIGURE_WIDTH_TOL_IN,
) -> None:
    """Book layout: pin y-tick ink to ``left_edge_in``, then fill nominal horizontal width.

    Title/subtitle use axes coordinates, so they stay aligned with the axes left edge.
    Sets ``fig._figure_left_align`` so ``save_figure`` uses the left-align export bbox.
    When ``fill_width`` is True, axes are resized so ink spans ~``target_width_in``
    (default ``FIGURE_TARGET_WIDTH_IN``); export remains tight to ink (no blank pad).
    """
    ax = ax if ax is not None else plt.gca()
    fig = fig if fig is not None else ax.figure
    width_target = float(FIGURE_TARGET_WIDTH_IN if target_width_in is None else target_width_in)

    _pin_y_tick_labels_to_left(fig, ax, left_edge_in=left_edge_in, tol_in=tol_in)
    if fill_width:
        _fill_axes_to_target_width(
            fig,
            ax,
            left_edge_in=left_edge_in,
            target_width_in=width_target,
            tol_in=width_tol_in,
        )
        _pin_y_tick_labels_to_left(fig, ax, left_edge_in=left_edge_in, tol_in=tol_in)

    fig._figure_left_align = True
    fig._figure_align_left_in = float(left_edge_in)
    fig._figure_target_width_in = width_target


def figure_type_color(facet_label: str) -> str:
    """Series color for the right-aligned figure-type title."""
    return {
        FACET_LABEL_TIME_SERIES: FIGURE_COLOR_TIME_SERIES,
        FACET_LABEL_COHORT_SERIES: FIGURE_COLOR_COHORT,
        FACET_LABEL_PERIOD_EFFECT: FIGURE_COLOR_PERIOD,
        FACET_LABEL_COHORT_EFFECT: FIGURE_COLOR_COHORT,
        FACET_LABEL_COHORT_OVER_SURVEY_YEARS: FIGURE_COLOR_TRAJECTORY,
    }.get(facet_label, "0.2")


def add_registration_marks(
    color: str,
    *,
    h_in: float = FIGURE_REG_MARK_H_IN,
    v_in: float = FIGURE_REG_MARK_V_IN,
    linewidth: float = FIGURE_REG_MARK_LINEWIDTH,
) -> list:
    """Record series color for left-edge L-marks (drawn at save time).

    With the left-alignment contract (``fig._figure_left_align``), marks sit on the
    fixed text-column edge. Otherwise they sit on the content tight-bbox left edge.
    """
    fig = plt.gcf()
    fig._figure_reg_mark_color = color
    fig._figure_reg_mark_kwargs = {"h_in": h_in, "v_in": v_in, "linewidth": linewidth}
    return []


def _clear_registration_mark_artists(fig) -> None:
    for artist in getattr(fig, "_figure_reg_mark_artists", []) or []:
        try:
            artist.remove()
        except ValueError:
            pass
    fig._figure_reg_mark_artists = []


def _draw_left_registration_marks(fig, *, x0: float, y0: float, x1: float, y1: float, color: str) -> list:
    """L-marks at the left corners of an export bbox given in figure inches."""
    from matplotlib.lines import Line2D

    fig_w, fig_h = fig.get_size_inches()
    kw = getattr(fig, "_figure_reg_mark_kwargs", {}) or {}
    h_in = kw.get("h_in", FIGURE_REG_MARK_H_IN)
    v_in = kw.get("v_in", FIGURE_REG_MARK_V_IN)
    linewidth = kw.get("linewidth", FIGURE_REG_MARK_LINEWIDTH)
    hx = h_in / max(fig_w, 1e-6)
    vy = v_in / max(fig_h, 1e-6)
    half_lw_in = (linewidth / 72.0) / 2.0
    inset_x = half_lw_in / max(fig_w, 1e-6)
    inset_y = half_lw_in / max(fig_h, 1e-6)

    fx0, fy0 = x0 / fig_w, y0 / fig_h
    fy1 = y1 / fig_h
    # Outer stroke on the alignment edge; arms extend inward (right / toward mid).
    corners = (
        (fx0 + inset_x, fy0 + inset_y, 1.0, 1.0),
        (fx0 + inset_x, fy1 - inset_y, 1.0, -1.0),
    )
    artists = []
    line_kw = dict(
        transform=fig.transFigure,
        color=color,
        linewidth=linewidth,
        solid_capstyle="butt",
        clip_on=False,
        zorder=100,
    )
    for x, y, hs, vs in corners:
        artists.append(Line2D([x, x + hs * hx], [y, y], **line_kw))
        artists.append(Line2D([x, x], [y, y + vs * vy], **line_kw))
    for artist in artists:
        fig.add_artist(artist)
    fig._figure_reg_mark_artists = artists
    return artists


def _place_registration_marks_left_align_contract(fig) -> list:
    """Fixed left edge + content-driven right/top/bottom; marks on the left edge only."""
    from matplotlib.transforms import Bbox

    color = getattr(fig, "_figure_reg_mark_color", None)
    left = float(getattr(fig, "_figure_align_left_in", FIGURE_ALIGN_LEFT_IN))
    fig._figure_save_bbox_inches = None
    _clear_registration_mark_artists(fig)

    fig.canvas.draw()
    renderer = fig.canvas.get_renderer()
    ink = fig.get_tightbbox(renderer)
    if ink is None:
        return []

    overhang = left - float(ink.x0)
    if overhang > FIGURE_ALIGN_TOL_IN:
        print(
            f"Warning: figure ink extends {overhang:.3f} in left of the book alignment edge."
        )

    right = float(ink.x1)
    if right <= left:
        right = left + 0.5
    padded = Bbox.from_extents(
        left,
        float(ink.y0) - FIGURE_SAVE_PAD_BOTTOM_INCHES,
        right,
        float(ink.y1) + FIGURE_SAVE_PAD_TOP_INCHES,
    )
    fig._figure_save_bbox_inches = padded

    ax = fig.axes[0] if fig.axes else None
    tick_left = leftmost_y_tick_label_x_inches(ax, renderer) if ax is not None else None
    axes_left = axes_left_x_inches(ax, renderer) if ax is not None else None
    fig._figure_align_diagnostics = {
        "left": left,
        "tick_left": tick_left,
        "axes_left": axes_left,
        "ink_x0": float(ink.x0),
        "ink_x1": float(ink.x1),
        "export": (padded.x0, padded.y0, padded.x1, padded.y1),
        "export_width": float(padded.x1 - padded.x0),
        "target_width": float(getattr(fig, "_figure_target_width_in", FIGURE_TARGET_WIDTH_IN)),
    }

    if color is None:
        return []
    marks = _draw_left_registration_marks(
        fig,
        x0=padded.x0,
        y0=padded.y0,
        x1=padded.x1,
        y1=padded.y1,
        color=color,
    )
    fig._figure_save_bbox_inches = _extend_below_marks(padded)
    return marks


def _place_registration_marks_on_tight_bbox(fig) -> list:
    """Legacy path: L-marks on content tight-bbox + vertical pad (left corners only)."""
    from matplotlib.transforms import Bbox

    color = getattr(fig, "_figure_reg_mark_color", None)
    fig._figure_save_bbox_inches = None
    if color is None:
        return []

    _clear_registration_mark_artists(fig)
    fig.canvas.draw()
    renderer = fig.canvas.get_renderer()
    content = fig.get_tightbbox(renderer)
    if content is None:
        return []

    pad_top = FIGURE_SAVE_PAD_TOP_INCHES
    pad_bottom = FIGURE_SAVE_PAD_BOTTOM_INCHES
    pad_h = FIGURE_SAVE_PAD_LEFT_RIGHT_INCHES
    padded = Bbox.from_extents(
        content.x0 - pad_h,
        content.y0 - pad_bottom,
        content.x1 + pad_h,
        content.y1 + pad_top,
    )
    marks = _draw_left_registration_marks(
        fig,
        x0=padded.x0,
        y0=padded.y0,
        x1=padded.x1,
        y1=padded.y1,
        color=color,
    )
    fig._figure_save_bbox_inches = _extend_below_marks(padded)
    return marks


def _extend_below_marks(bbox):
    """Save area extended below the lower registration mark (see FIGURE_REG_MARK_BOTTOM_PAD_IN)."""
    from matplotlib.transforms import Bbox

    return Bbox.from_extents(bbox.x0, bbox.y0 - FIGURE_REG_MARK_BOTTOM_PAD_IN, bbox.x1, bbox.y1)


def _prepare_save_bbox_and_marks(fig) -> list:
    if getattr(fig, "_figure_left_align", False):
        return _place_registration_marks_left_align_contract(fig)
    return _place_registration_marks_on_tight_bbox(fig)


def add_split_figure_title(
    subject: str,
    figure_type: str,
    *,
    pad: float | None = None,
    figure_type_color: str | None = None,
) -> None:
    """Title row: subject as a real left title; plot type right-aligned at the same height.

    Using ``Axes.set_title`` for the subject keeps Matplotlib's layout / ``bbox_inches='tight'``
    happy. Title ``pad`` is applied as a transform offset (not in ``get_position()``), so we
    draw once and map the title's display position back to axes coordinates for the right label.
    Left title is bold; right figure-type label is regular weight in the header text color.
    """
    ax = plt.gca()
    fig = ax.figure
    title_pad = FIG_HEADER_TITLE_PAD_PT if pad is None else pad
    title = ax.set_title(
        subject,
        loc="left",
        pad=title_pad,
        fontsize=FIGURE_TITLE_FONTSIZE,
        fontweight="bold",
    )
    fig.canvas.draw()
    x_disp, y_disp = title.get_transform().transform(title.get_position())
    _, title_y = ax.transAxes.inverted().transform((x_disp, y_disp))
    type_text = (figure_type or "").strip()
    if type_text:
        type_color = FIGURE_HEADER_TEXT_COLOR  # neutral; figure_type_color no longer used here
        ax.text(
            1.0,
            title_y,
            type_text,
            transform=ax.transAxes,
            ha="right",
            va=title.get_va(),
            fontsize=FIGURE_TITLE_FONTSIZE,
            fontweight="normal",
            color=type_color,
            clip_on=False,
        )


def add_subtitle(subtitle, **options):
    """Add a subtitle below the title (facet / outcome wording).

    Bottom-anchored at ``FIG_HEADER_SUBTITLE_Y`` in axes coordinates so the subtitle keeps a
    fixed relationship with the plotting box; multi-line strings extend upward toward the title.
    Tune title ``pad`` in ``add_title`` for clearance above the subtitle.

    options: passed to ``plt.text``; underride sets defaults.
    """
    ax = plt.gca()
    opts = dict(**options)
    underride(
        opts,
        x=0,
        y=FIG_HEADER_SUBTITLE_Y,
        transform=ax.transAxes,
        color="0.2",
        ha="left",
        va="bottom",
        linespacing=FIG_SUBTITLE_LINESPACING,
        clip_on=False,
    )
    x = opts.pop("x")
    y = opts.pop("y")
    plt.text(x, y, subtitle, **opts)


def add_figure_header(
    subject: str,
    figure_type: str,
    y_axis_label: str,
    source: str,
    *,
    pad: float | None = None,
    figure_type_color: str | None = None,
    left_align: bool = False,
) -> None:
    """Task 114 header: split title, then subtitle row (y-axis left, source right).

    Pass ``figure_type=\"\"`` to omit the upper-right type label (default path when the series
    type is identified in a legend instead).

    If ``left_align`` is True, pin y-tick labels to ``FIGURE_ALIGN_LEFT_IN``, fill
    nominal horizontal width, and enable the left-align export path in ``save_figure``.
    """
    add_split_figure_title(subject, figure_type, pad=pad, figure_type_color=figure_type_color)
    add_subtitle(y_axis_label, x=0, ha="left")
    add_subtitle(source, x=1, ha="right")
    if left_align:
        apply_book_left_alignment()
    add_registration_marks(FIGURE_REG_MARK_COLOR)


def warn_lines_at_axis_floor(fig, name: str = "") -> list[str]:
    """Warn about data lines that touch the bottom of the y-axis.

    A line drawn exactly at the lower y-limit is clipped to half its width (e.g. a series
    at 0 with ``ylim(0, ...)``). Pad the bottom slightly instead, as the CAWP and
    corporate-leadership figures do (``ylim(-0.6, ymax)``; about 1% of the range).
    Horizontal reference lines (constant y) are ignored. Returns the warnings.
    """
    import numpy as _np

    warnings_out: list[str] = []
    for ax in fig.get_axes():
        lo, hi = ax.get_ylim()
        if ax.get_yscale() != "linear" or hi <= lo:
            continue
        tol = 1e-6 * (hi - lo)
        for line in ax.get_lines():
            y = _np.asarray(line.get_ydata(), dtype=float)
            y = y[_np.isfinite(y)]
            if len(y) < 2 or _np.ptp(y) == 0 or not line.get_visible():
                continue
            if y.min() <= lo + tol:
                label = line.get_label()
                msg = (f"Line {label!r} touches the bottom of the y-axis ({lo:g}) and is clipped "
                       f"to half width{' in ' + name if name else ''}; pad the lower y-limit "
                       f"(about 1% of the range).")
                warnings_out.append(msg)
                print("WARNING: " + msg)
    return warnings_out


def save_figure(
    fig,
    root: str | Path,
    *,
    bbox_extra_artists=(),
    dpi_print: int = FIGURE_DPI,
    save_social: bool = False,
    social_branding: str | None = None,
    social_dpi: int = FIGURE_DPI_SOCIAL,
    close: bool = True,
) -> list[Path]:
    """Save PDF + PNG @ ``dpi_print``; optionally a social PNG @ ``social_dpi``.

    Print exports keep left-edge registration marks and omit the landing URL.
    When ``save_social`` is True, also write ``*_social.png`` (no marks) with
    ``BOOK_LANDING_SHORT_URL`` (or ``social_branding``) in the lower-right corner.
    Production pipelines leave ``save_social=False``; opt in when preparing social posts.
    """
    # Do not use Path.suffix / with_suffix: artifact stems contain version dots
    # (e.g. ``c0.125_t0.125``) that pathlib treats as extensions.
    root_s = str(root)
    for ext in (".pdf", ".png", ".svg"):
        if root_s.endswith(ext):
            root_s = root_s[: -len(ext)]
            break
    # Place registration marks and choose export bbox (left-align contract or legacy tight).
    warn_lines_at_axis_floor(fig, Path(root_s).name)
    reg_artists = _prepare_save_bbox_and_marks(fig)
    extras = list(bbox_extra_artists) if bbox_extra_artists else []
    extras.extend(reg_artists)
    extras_t = tuple(extras) if extras else None
    save_bbox = getattr(fig, "_figure_save_bbox_inches", None)
    if save_bbox is None:
        bbox_kw = {"bbox_inches": "tight", "pad_inches": FIGURE_SAVE_PAD_INCHES}
    else:
        # Explicit padded bbox: marks sit at its corners; do not add a second pad.
        bbox_kw = {"bbox_inches": save_bbox, "pad_inches": 0}
    saved: list[Path] = []

    pdf_path = Path(f"{root_s}.pdf")
    fig.savefig(pdf_path, bbox_extra_artists=extras_t, **bbox_kw)
    saved.append(pdf_path)

    png_path = Path(f"{root_s}.png")
    fig.savefig(
        png_path,
        dpi=dpi_print,
        bbox_extra_artists=extras_t,
        **bbox_kw,
    )
    saved.append(png_path)

    if save_social:
        _clear_registration_mark_artists(fig)
        brand = social_branding if social_branding is not None else BOOK_LANDING_SHORT_URL
        # Lower-right of the export: prefer axes coords so the URL sits under the plot.
        ax = fig.axes[0] if fig.axes else None
        if ax is not None:
            brand_artist = ax.text(
                1.0,
                -0.18,
                brand,
                transform=ax.transAxes,
                ha="right",
                va="top",
                fontsize=FIGURE_SOCIAL_BRAND_FONTSIZE,
                color=FIGURE_SOCIAL_BRAND_COLOR,
                clip_on=False,
                zorder=50,
            )
        else:
            brand_artist = fig.text(
                0.99,
                0.01,
                brand,
                transform=fig.transFigure,
                ha="right",
                va="bottom",
                fontsize=FIGURE_SOCIAL_BRAND_FONTSIZE,
                color=FIGURE_SOCIAL_BRAND_COLOR,
            )
        social_extras = list(bbox_extra_artists) if bbox_extra_artists else []
        social_extras.append(brand_artist)
        social_extras_t = tuple(social_extras) if social_extras else None
        # Social: tight crop including the URL (no print registration marks).
        social_bbox_kw = {"bbox_inches": "tight", "pad_inches": FIGURE_SAVE_PAD_INCHES}
        social_path = Path(f"{root_s}_social.png")
        fig.savefig(
            social_path,
            dpi=social_dpi,
            bbox_extra_artists=social_extras_t,
            **social_bbox_kw,
        )
        saved.append(social_path)
        try:
            brand_artist.remove()
        except ValueError:
            pass

    if close:
        plt.close(fig)
    return saved


def _label_color(color, max_lightness: float = 55.0):
    """Line color for a direct label, darkened when light so the text stays legible."""
    from matplotlib.colors import to_hex, to_rgb

    def lightness(h):
        """CIE L* of a hex color (from CultureWar's palette module, which moved)."""
        c = np.array(to_rgb(h))
        c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
        y = c @ np.array([0.2126, 0.7152, 0.0722])
        f = np.cbrt(y) if y > 0.008856 else 7.787 * y + 16 / 116
        return 116 * f - 16

    rgb = to_rgb(color)
    for _ in range(12):
        if lightness(to_hex(rgb)) <= max_lightness:
            break
        rgb = tuple(0.9 * c for c in rgb)
    return rgb


def _add_direct_line_labels(
    ax,
    *,
    side: str = "right",
    x_offset_pt: float = 3.0,
    min_gap_frac: float = 0.075,
    nudge_pt: dict[str, float] | None = None,
    dodge: bool = True,
    sides: dict[str, str] | None = None,
    _only: set[str] | None = None,
) -> None:
    """Label each labeled series in its own color, instead of a legend.

    ``side="right"``: just right of the line's last point. ``side="left"``: just
    left of its first point (needs room left of the lines, so not for series that
    start at the axis edge). Labels closer than ``min_gap_frac`` of the y-range
    are nudged apart vertically, keeping their top-to-bottom order. ``nudge_pt``
    moves individual labels vertically by that many points (e.g. off a marker).
    ``dodge=False`` skips the automatic nudging, so only ``nudge_pt`` moves labels.
    ``sides`` puts individual labels on the other side (e.g. ``{"6": "right"}`` with
    ``side="left"``); each side is spread apart separately. ``"above"`` centers a label
    over the line's last point (``nudge_pt`` sets its height, default 4 points).
    """
    if sides:
        labels = [ln.get_label() for ln in ax.get_lines()
                  if ln.get_label() and not ln.get_label().startswith("_")]
        for s in ("left", "right", "above"):
            subset = {lab for lab in labels if sides.get(lab, side) == s}
            if subset:
                _add_direct_line_labels(
                    ax, side=s, x_offset_pt=x_offset_pt, min_gap_frac=min_gap_frac,
                    nudge_pt=nudge_pt, dodge=dodge, _only=subset,
                )
        return
    ends = []
    for line in ax.get_lines():
        label = line.get_label()
        if not label or label.startswith("_"):
            continue
        if _only is not None and label not in _only:
            continue
        x = np.asarray(line.get_xdata(), dtype=float)
        y = np.asarray(line.get_ydata(), dtype=float)
        ok = np.isfinite(x) & np.isfinite(y)
        if not ok.any():
            continue
        i = 0 if side == "left" else -1  # "above" uses the last point, like "right"
        ends.append({"label": label, "x": x[ok][i], "y": y[ok][i], "color": line.get_color()})
    if not ends:
        return
    lo, hi = ax.get_ylim()
    gap = min_gap_frac * (hi - lo)
    x0, x1 = ax.get_xlim()
    x_gap = 0.08 * abs(x1 - x0)  # labels this far apart in x don't collide
    ends.sort(key=lambda e: -e["y"])
    if dodge:
        # Spread labels that are too close, splitting the move between them: each group of
        # crowded labels (close in x and y) is spaced ``gap`` apart and centered on the
        # group's original mean, so no one label does all the moving.
        for e in ends:
            e["y0"] = e["y"]
        groups: list[list[dict]] = []
        for e in ends:
            g = groups[-1] if groups else None
            if g and abs(g[-1]["x"] - e["x"]) < x_gap and g[-1]["y0"] - e["y0"] < gap:
                g.append(e)
            else:
                groups.append([e])
        for g in groups:
            if len(g) == 1:
                continue
            center = sum(e["y0"] for e in g) / len(g)
            top = center + gap * (len(g) - 1) / 2
            for k, e in enumerate(g):
                e["y"] = top - k * gap
        for e in ends:
            e["y"] = min(max(e["y"], lo + 0.5 * gap), hi - 0.5 * gap)
    for e in ends:
        if side == "left":
            offset, ha, va = (-x_offset_pt, 0), "right", "center"
        elif side == "above":
            offset, ha, va = (0, 0 if e["label"] in (nudge_pt or {}) else 4.0), "center", "bottom"
        else:
            offset, ha, va = (x_offset_pt, 0), "left", "center"
        offset = (offset[0], offset[1] + (nudge_pt or {}).get(e["label"], 0.0))
        ann = ax.annotate(
            e["label"],
            xy=(e["x"], e["y"]),
            xytext=offset,
            textcoords="offset points",
            ha=ha,
            va=va,
            color=_label_color(e["color"]),
            clip_on=False,
            zorder=40,
        )
        if side == "right":
            _keep_label_in_figure(ax, ann)


LABEL_OVERFLOW_TOLERANCE_PT = 8.0


def _keep_label_in_figure(ax, ann) -> None:
    """If a label placed right of a line's end runs past the figure's right edge by more
    than ``LABEL_OVERFLOW_TOLERANCE_PT``, move it under the end point instead
    (right-aligned, so it ends at the point)."""
    fig = ax.figure
    renderer = fig.canvas.get_renderer()
    tolerance_px = LABEL_OVERFLOW_TOLERANCE_PT * fig.dpi / 72.0
    if ann.get_window_extent(renderer).x1 <= fig.bbox.x1 + tolerance_px:
        return
    ann.set_ha("right")
    ann.set_va("top")
    ann.xyann = (0.0, -4.0)


def _add_inline_line_labels(
    ax,
    placements: dict[str, tuple],
) -> None:
    """Label lines at chosen points instead of at their ends.

    ``placements`` maps a line's label to ``(x, offset_pt)``: the label goes at the
    line's y at ``x`` (interpolated), ``offset_pt`` points above it if positive or
    below it if negative. For figures where the line ends crowd together.

    A third element ``"start"`` or ``"end"`` puts the label beside the line instead:
    left of its first point or right of its last (``x`` is ignored), raised by
    ``offset_pt``. So one figure can label some lines at the left and others at the right.
    """
    for line in ax.get_lines():
        label = line.get_label()
        if label not in placements:
            continue
        spec = placements[label]
        x_at, offset = spec[0], spec[1]
        side = spec[2] if len(spec) > 2 else None
        x = np.asarray(line.get_xdata(), dtype=float)
        y = np.asarray(line.get_ydata(), dtype=float)
        ok = np.isfinite(x) & np.isfinite(y)
        if side in ("start", "end"):
            k = 0 if side == "start" else -1
            x_at, y_at = float(x[ok][k]), float(y[ok][k])
            xytext = (-DIRECT_LABEL_GAP_PT if side == "start" else DIRECT_LABEL_GAP_PT, offset)
            ha, va = ("right" if side == "start" else "left"), "center"
        else:
            y_at = float(np.interp(x_at, x[ok], y[ok]))
            xytext, ha, va = (0, offset), "center", ("bottom" if offset >= 0 else "top")
        ann = ax.annotate(
            label,
            xy=(x_at, y_at),
            xytext=xytext,
            textcoords="offset points",
            ha=ha,
            va=va,
            color=_label_color(line.get_color()),
            zorder=40,
        )
        if side == "end":
            _keep_label_in_figure(ax, ann)
