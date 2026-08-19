---
title: Block Patterns & Workflow
impact: HIGH
impactDescription: Well-designed blocks make the editing experience self-explanatory; poorly designed ones force editors back to developers. These patterns keep blocks reusable, complete-by-default, and safe to arrange in any order.
tags: workflow, patterns, best practices
---

## Block Patterns & Workflow

### Build workflow

When creating a new block:

1. **Create the file** — `views/canopy/<name>.canvas`. Pick a name editors will recognize (`hero`, `features`, `testimonial`), not implementation jargon.
2. **Write the config first** — decide what editors should control before writing markup. Fewer, well-labelled settings beat many granular ones.
3. **Give every setting a `default`** — the block must look complete and presentable the instant an editor adds it, and defaults double as placeholder content when previewing.
4. **Write the template** — guard optional object/array values, use `|raw` for richtext.
5. **Preview while building** — drop `{{ canopy.render('<name>') }}` into a page to see the block with its defaults, and pass a settings object to test variants. Remove the call when done unless the section should stay fixed.
6. **Wire up the layout** — make sure the target layout renders a block area (`canopy.blocks`) plus matching `canopy.head`/`canopy.scripts`.
7. **Verify in the Canopy editor** — the block should appear in the editor's template list; check each setting field shows up (a missing field means invalid config JSON or a bad `type`).

### Design guidance

- **A block is a complete section, not a widget.** Model whole sections (hero, feature grid, CTA banner, FAQ), so editors compose pages by stacking blocks. Don't make micro-blocks (single button, single paragraph) that force editors to assemble layouts themselves.
- **Blocks must work in any order.** Editors can drag blocks freely — never write a block that assumes it sits above/below another block.
- **Constrain choices with `select`/`radio`** for variants like alignment, background theme, or column count, so editors can only pick valid values. Never ask editors to type CSS classes or hex codes into text fields (use `color` for colors).
- **Constrain `heading` elements** to what the page structure allows (e.g. `h2`/`h3` for mid-page blocks) so editors can't break the heading hierarchy.
- **Use `checkbox` toggles for optional parts** of a section (e.g. "show CTA button") and guard the markup with `{% if %}`.
- **Use nested blocks for repeatable rich items inside a section** (gallery images, slides, accordion/tab items). Prefer them over a `list` setting when each item needs its own settings form; see `rules/nested-blocks.md`.
- **Organize dense settings forms with `tab` and `group`.** A common split is a **Content** tab (text, images, links) and a **Style** tab (colors, alignment, spacing), with related fields under collapsible groups. Settings sharing a `group` must sit consecutively in the `settings` array; settings without a `tab` land under a **General** tab.
- **Keep block-specific CSS/JS in `head`/`scripts` sections**, not inline in the template — they dedupe once per area and keep the rendered blocks clean.
- **Content ownership:** page-scoped block areas for per-page content; `{ shared: true }` areas for global sections; Collections for structured, queryable data (blog posts, products, team members) — blocks can render Collection data, but the data itself belongs in the Collection.

### Common block shapes

| Block        | Typical settings                                                                      |
| ------------ | -------------------------------------------------------------------------------------- |
| Hero         | `heading`, `textarea` intro, `url` CTA, `file` background image, `select` alignment  |
| Feature grid | `heading`, `list` of features (or a Collection for richer items), `select` columns   |
| CTA banner   | `heading`, `text` subline, `url` button, `color` background                          |
| Rich content | `richtext` body (output with `|raw` inside a prose wrapper)                           |
| Media        | `media-sources` for video/audio, `file` poster image, `checkbox` autoplay            |
| Footer       | Rendered in a `{ shared: true }` area so it's managed once for the whole site        |

### Pitfalls checklist

- Config JSON invalid (single quotes, trailing comma) → settings silently ignored.
- Setting `type` misspelled → field never appears in the editor, no error.
- Duplicate setting `name`s in one block → colliding values; keep names unique per block.
- `canopy.head`/`canopy.scripts` missing or using a different handle than `canopy.blocks` → block CSS/JS never loads.
- Expecting a `shared` area to differ per page (or a page-scoped area to be global) → check the `shared` option matches the content's scope.
- Richtext output without `|raw` → escaped HTML shown as literal text.
- Object values (`settings.cta.url`, `settings.image.path`) rendered without an `{% if %}` guard → broken links/attributes when the editor hasn't filled the field and there's no default.
- Using `canopy.render` for content editors are expected to manage → editors can't edit it; use a block area.
