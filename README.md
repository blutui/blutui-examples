# blutui-examples

Example projects for [Blutui](https://www.blutui.com), each living in its own
folder. Every project is self-contained: `cd` into it, install its
dependencies, and run it with the Blutui Courier CLI.

## Examples

### [`blocks/simple-blocks-usage`](blocks/simple-blocks-usage)

A Schweppes-inspired brand site showing **simple, straightforward Canopy
blocks**. Each block is a self-contained section (hero, product hero, story,
heritage timeline, recipes, nutrition table, tasting notes, royal warrant and
more) with a small set of Content/Style settings and sensible image defaults,
so it's easy to see how a block's `config` and `template` sections fit
together.

Highlights:

- **17 content blocks** across a home page and a product page, composed with
  two layouts (`home` and `product`) and shared header/footer components.
- **Simple settings model**: headings, text, image uploads and the occasional
  checkbox; every setting falls back to a bundled default image or copy, so
  blocks render finished-looking straight out of the box.
- **Nested block partials**: repeatable rows like products, tasting notes and
  nutrition entries live as sub-templates (`products/item.canvas`,
  `nutrition/row.canvas`), showing how to structure list-style blocks.

**Run it locally:**

```bash
cd blocks/simple-blocks-usage
npm install
npm run dev      # Tailwind/Parcel watch
courier dev      # serves at https://localhost:8080
```

### [`blocks/highly-editable-blocks`](blocks/highly-editable-blocks)

An artist landing page built as a system of **highly editable Canopy blocks**.
One Site Theme block drives colours, typography and styling site-wide via CSS
custom properties, and every other block inherits from it, so editors can
compose and restyle entire pages in the Canopy editor without touching code.

Highlights:

- **Site Theme block**: 13 colour presets (plus full custom palettes), 36
  heading fonts, button styles, corner rounding, page textures, and a display
  size scale, all mapped to Tailwind utilities through `@theme inline`.
- **25+ content blocks**: hero (including 6 WebGL shader variants powered by
  [Paper Shaders](https://paper.design)), tour dates, discography, merch,
  gallery, band members, press, FAQ, forms and more, each with multiple layout
  variations plus shared Style and Visibility tabs.
- **Collection-driven content**: ten CMS Collections back the data blocks;
  three blocks share the `tour_dates` collection and slice it into upcoming
  shows, the next show, and past gigs automatically.

See the project's [BLOCKS.md](blocks/highly-editable-blocks/BLOCKS.md) for the
full block reference, plus hard-won notes on Canopy/Canvas constraints
(`canopy.head` limits, form handle literals, collection guards).

**Run it locally:**

```bash
cd blocks/highly-editable-blocks
npm install
npm run dev      # Tailwind/Parcel watch
courier dev      # serves at https://localhost:8080
```

### [`blocks/collection-block`](blocks/collection-block)

A fictional awards site, **The Meridian Awards**, showing how **Canopy blocks
and Collections work together** — including two ways to model a many-to-many
relationship (awards ↔ judges) while Blutui's collection links are still
single-relation.

Highlights:

- **Technique 1: multi-select + filter** — the `awards` collection stores judge
  slugs in a checkbox field, and templates join the two collections with a
  `filter`, in both directions (award → judging panel, judge → their awards).
- **Technique 2: entry-select merge** — an Award Spotlight block pairs a
  single-select `entry` setting (awards) with a multi-select `entry` setting
  (judges) for per-page editorial curation, falling back to Technique 1 when no
  judges are picked.
- **Two rendering styles** — the homepage renders a fixed showcase sequence of
  blocks, while a freeform layout leaves an open block area for
  dashboard-created pages; both share a site-wide Footer block area.

See the project's [README](blocks/collection-block/README.md) for the full
walkthrough, collection schemas and block reference.

**Run it locally:**

```bash
cd blocks/collection-block
npm install
npm run dev      # Tailwind watch
courier dev      # serves at https://localhost:8080
```

---

All examples require the [Courier CLI](https://www.blutui.com/docs/courier)
and a `courier.json` pointing at your own site handle (not committed — see
`.gitignore`).
