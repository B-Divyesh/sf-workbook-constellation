# Workbook Constellation — visual thesis

## Direction

**Surreal editorial scenery: the night observatory for inherited workbooks.** A workbook becomes an archival sky chart: tabs are cut-paper islands, formulas are taut copper paths, and warning conditions are vermilion eclipse marks. The imagery explains the product’s central act—seeing structure that is otherwise hidden—without pretending to show calculated results.

The application itself is a quiet instrument panel set below that scene. It uses paper-like surfaces, crisp dark rules, offset labels, and a single electric-cyan selection color. It must feel like an auditor’s annotated atlas, not a generic dashboard.

## Tokens

- Night ink `#101920`: main background and primary text in inverse regions.
- Ledger paper `#F5F0E6`: primary light surface.
- Archive white `#FFFDF7`: raised surface.
- Slate `#4D5A60`: secondary text; verified at 4.5:1 on paper.
- Signal cyan `#087E8B`: actions, focus, and selected dependency paths.
- Vermilion `#BC3A2D`: external, circular, or opaque warnings.
- Brass `#6B4108`: formula and caution accents with accessible contrast on paper.
- Moss `#337055`: safe/local status.

The product is deliberately single-mode. Its ink-and-paper contrast is part of the editorial premise, while the graph canvas uses the dark night field.

## Type

- Display: Georgia, `Times New Roman`, serif. Editorial, self-host-free, and familiar in financial documents.
- Interface/body: system sans (`Inter`-shaped platform stack). Neutral beside the expressive headings.
- Formula and cell references: `ui-monospace`, SFMono-Regular, Consolas.
- Body starts at 16px; graph labels at 13px with strong contrast. Numeric tables use tabular figures.

## Spacing and shape

An 8px base rhythm. Sections use 64–112px vertical gaps. Controls are at least 44px. Panels have clipped top-right corners, like a paper tab, instead of generic rounded cards. Graph nodes look like index cards pinned to a deep-blue map.

## Interaction grammar

- Selecting a sheet pulls its connected paths into cyan and dims unrelated paths.
- Selecting an edge reveals the exact source and destination references in a nearby proof panel.
- Filters behave like annotated ledger tabs, with explicit labels and counts.
- File handling is always described as read-only. Dragging is optional; the real file button remains keyboard accessible.

## Motion policy

The signature motion is **constellation draw-in**: dependency paths resolve outward from the selected sheet over 220ms. Panels enter with a restrained 160ms opacity and translate transition. Under `prefers-reduced-motion: reduce`, all movement becomes an immediate opacity change; no animation loops.

## Generated asset plan and provenance

Hero and social art use one original surreal editorial still life: an open ledger as a night landscape, small paper tab islands connected by copper threads under an observatory lamp. No interface text appears inside the art.

Prompt sheet:

> Use case: stylized-concept. Asset type: wide landing-page hero and social crop. Primary request: a surreal editorial still life where an open accounting workbook becomes a midnight topographic landscape; layered paper worksheet tabs rise like small islands and fine copper threads connect them as a precise constellation. Scene/backdrop: quiet archive observatory, no people. Style/medium: tactile cut-paper editorial illustration with subtle photographic material detail, restrained and sophisticated. Composition: wide 3:2 view, primary cluster on the right, calm negative space on the left, clear focal depth. Lighting: one warm brass task lamp against deep blue-black shadow. Palette: night ink, ledger ivory, oxidized cyan, vermilion pin marks, muted brass. Materials: deckled paper, graphite rules, copper wire, frosted glass. Constraints: no readable text, no formulas, no logos, no brands, no watermark, no hands, no faces, no UI screenshot. Avoid: generic gradients, neon sci-fi, glowing orbs, stock-office imagery, illegible pseudo-text, clutter.

Generated with the factory image model on 2026-08-28. The selected source and prompt sidecar live in `assets/src/`; optimized derivatives live in `public/art/`. Generated imagery is original to this product.

The three desktop walkthrough frames are direct captures of the product’s bundled sample on 2026-08-29. They show the real open, inspect, and export states and introduce no third-party artwork.
