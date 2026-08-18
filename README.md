# blutui-examples

Example projects for [Blutui](https://www.blutui.com), each living in its own
folder. Every project is self-contained — `cd` into it, install its
dependencies, and run it with the Blutui Courier CLI.

## Examples

### [`blocks/highly-editable-blocks`](blocks/highly-editable-blocks)

An artist landing page built as a system of **highly editable Canopy blocks**.
One Site Theme block drives colours, typography and styling site-wide via CSS
custom properties, and every other block inherits from it — so editors can
compose and restyle entire pages in the Canopy editor without touching code.

Highlights:

- **Site Theme block** — 13 colour presets (plus full custom palettes), 36
  heading fonts, button styles, corner rounding, page textures, and a display
  size scale, all mapped to Tailwind utilities through `@theme inline`.
- **25+ content blocks** — hero (including 6 WebGL shader variants powered by
  [Paper Shaders](https://paper.design)), tour dates, discography, merch,
  gallery, band members, press, FAQ, forms and more, each with multiple layout
  variations plus shared Style and Visibility tabs.
- **Collection-driven content** — ten CMS Collections back the data blocks;
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

Requires the [Courier CLI](https://www.blutui.com/docs/courier) and a
`courier.json` pointing at your own site handle (not committed — see
`.gitignore`).
