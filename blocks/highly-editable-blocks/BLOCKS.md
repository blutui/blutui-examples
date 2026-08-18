# Artist landing page — Canopy Blocks

A block system for an artist site: one theme block drives colours and fonts
site-wide, and every other block inherits from it. Editors compose pages in the
Canopy editor without touching code.

## How the theme works

`views/canopy/theme.canvas` renders an inline `<style>` block that sets CSS
custom properties (`--site-bg`, `--site-accent`, `--site-font-heading`, …).
`src/styles/global.css` maps those to Tailwind utilities via `@theme inline`, so
every block can use `bg-bg`, `text-ink`, `bg-accent`, `bg-accent-2`,
`border-line`, `font-heading` and `rounded-theme` and automatically follow the
theme.

Defaults also live in `:root` in `global.css`, so the site looks finished before
an editor adds the Site Theme block.

**Add the Site Theme block once** — it lives in a `shared: true` area, so it
applies to every page on the site.

### What editors can change

| Tab        | Settings                                                                     |
| ---------- | ---------------------------------------------------------------------------- |
| Colours    | 13 presets or Custom, with 9 colour pickers including a **second accent**     |
| Typography | 36 heading fonts, 18 body fonts, heading case/tracking, weight, line height, display size, nav case |
| Style      | Corner rounding, content width, button style/shape/case, page texture         |

**Second accent** (`bg-accent-2`, `text-accent-2`) exists so two-colour poster
palettes work — the Poster preset is black with screen-print red *and* acid
yellow, and blocks can reach for either.

**Button styles** — Solid, Outline, Brutal (hard offset shadow) and Ghost. The
theme block emits real `.btn-*` overrides rather than passing classes around, so
every button on the site changes at once.

**Page texture** — Film grain, Scanlines or Vignette, painted by `body::after`
at an adjustable strength. Off by default.

Fonts load from [Bunny Fonts](https://fonts.bunny.net) — a GDPR-friendly Google
Fonts mirror, so no consent banner is needed for them. Every family in the list
is requested with weights it actually publishes; asking Bunny for a weight a
family doesn't have silently drops the whole font.

### Display size and Tailwind

The "Display size" setting works by redefining `--text-4xl` … `--text-9xl` in
`@theme inline` as `calc(<size> * var(--site-display-scale))`. That only affects
the large sizes used for headings — body copy keeps Tailwind's defaults. A
heading written with an arbitrary size (`text-[9rem]`) won't scale, which is why
the blocks use the named steps.

## The blocks

Every content block shares the same **Style** tab: background tone
(page / card / accent / inverted / custom colours), vertical spacing, and an
anchor ID so menu links like `#tour` work. Most also have a **Visibility** tab
of checkboxes for turning individual pieces of content on and off.

| Block                     | Variations                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| **Site Theme**            | — (colours, fonts, radius, width, buttons, texture)               |
| **Site Header**           | Inline / centred / split / floating / poster / side rail / minimal |
| **Site Footer**           | Big / columns / poster / stacked / corners / minimal              |
| **Hero**                  | Spotlight / poster / stack / card / corner / split / minimal      |
|                           | Heading can be text **or** artwork, in every layout               |
| **Hero (Animated Shader)**| 6 WebGL shaders — see below                                       |
| **Music Release**         | Featured / stacked / embed                                        |
| **Discography (Collection)** | Grid / list / strip / featured — reads a Collection            |
| **Merch (Collection)**    | Grid / strip / list / featured — reads a Collection               |
| **Tour Dates**            | Rows / cards / compact — list *or* Collection                     |
| **Tickets**               | Spotlight / banner / panel / outlets — next show or typed in      |
| **Past Gigs (Archive)**   | By year / rows / cards / poster — list *or* Collection            |
| **Video**                 | Wide / split / edge-to-edge — YouTube, Vimeo or upload            |
| **Gallery (Collection)**  | Grid / masonry / mosaic / strip / stack — reads a Collection      |
| **Band Members (Collection)** | Lead / grid / list / profile / strip — reads a Collection      |
| **History / Timeline**    | Timeline / alternating / cards / list / strip — list *or* Collection |
| **Downloads (Collection)**| Grid / list / featured / strip — reads a Collection                |
| **Articles & Press (Collection)** | Grid / magazine / list / press / featured — two Collections |
| **Text / About**          | Single / two-column / with image / wide                           |
| **Press Quotes**          | Featured / grid / ticker                                          |
| **Social Links**          | Row / tiles / cards / list / display type                         |
| **Call to Action**        | Centred / banner / image background / boxed                       |
| **FAQ**                   | Accordion / columns / split                                       |
| **Contact / Signup**      | Split / centred / boxed                                           |
| **Fan Club Registration** | Image / split / boxed / banner                                    |
| **Marquee Banner**        | Scrolling text bar, 3 speeds, 4 sizes                             |
| **Divider / Spacer**      | Space / line / inset line / labelled line                         |

### The side-rail header

The `rail` header layout is a fixed left column rather than a bar, so the rest
of the page has to move across by the same amount. The block sets `--rail-width`
on `:root` (it has to be `:root` — a value set on the rail element isn't
readable from a `body` rule), and `global.css` shifts the body's direct children
with `body:has(.site-rail) > *:not(.site-rail)`. Shifting the children rather
than padding `<body>` keeps the page background full-bleed behind the rail.
Below `lg` it collapses to an ordinary top bar.

That CSS lives in `global.css` rather than the block, for the reason below.

### Two hard limits on `canopy.head` / `canopy.scripts`

Both cost real debugging time, and both fail silently.

**They return nothing for a shared area.** They take a handle only — there's no
`shared` option — and blocks in the `theme`, `header` and `footer` areas are
simply not found. A `head` section on the header block never loads, with no
error. Put CSS for shared-area blocks in `global.css` instead. The calls in
`default.html` are only for the page-scoped `main` area.

**Their contents are emitted verbatim, without evaluating Canvas.** A
`{{ asset('js/x.js') | script_tag }}` inside one lands on the page as literal
text. Emit script tags from the *template* section, where Canvas does evaluate
and `asset()` resolves correctly in dev and production.

A related trap: **Canopy splits a block file by scanning for its section tags as
plain text, including inside `{# #}` comments.** Writing the words for a section
tag in a comment opens a real section and everything after it stops being
template. Don't name them in comments.

### Heading as artwork

Releases often have the title set as custom artwork rather than type, so both
Hero blocks can swap the heading for an image in **every** layout: **Text**,
**Artwork — upload**, or **Artwork — from the Brand collection**.

The heading text is kept either way and used as the image's alt text, so the
page still reads correctly to search engines and screen readers. Size classes
and measure limits (`max-w-[16ch]`) only apply to real type; the image is sized
by an explicit width in px.

### Hero media

Hero layouts that sit on media (`spotlight`, `poster`, `stack`, `card`,
`corner`) accept an image **or** a video. A video wins when both are set, and
the image is reused as its poster frame so there's no black flash on load.

## Animated shader heroes

`views/canopy/hero-shader.canvas` renders a WebGL background using
[Paper Shaders](https://paper.design) (`@paper-design/shaders`).

| Preset          | Look                                    |
| --------------- | --------------------------------------- |
| Liquid mesh     | Flowing marbled colour                  |
| Warp            | Smoky swirling bands                    |
| Grain gradient  | Risograph-style grain                   |
| God rays        | Light radiating from the centre         |
| Swirl           | Twisting concentric bands               |
| Dither          | Lo-fi two-tone print                    |

Editors get up to 5 colours (3–5 are individually switchable), a backdrop
colour, and sliders for speed, zoom, rotation, intensity, distortion, softness
and grain. One generic slider maps onto whichever uniform each shader actually
exposes, so switching preset doesn't make the controls meaningless.

**How it's wired.** The block serialises its settings to a `data-shader` JSON
attribute; `src/js/shader-bg.js` reads them and mounts a canvas. Three details
matter:

- The mount element **must** carry `data-paper-shader`. Paper Shaders injects
  its own stylesheet on first mount, and that's the selector it positions the
  canvas with.
- `getShaderNoiseTexture()` returns an `<img>` that **hasn't loaded yet**, and
  `ShaderMount` throws if a texture uniform isn't fully decoded. Warp, grain and
  rays all sample it, so mounting waits on the image's `load` event. Skipping
  that wait silently kills those three presets.
- The `<script>` tag is emitted from the block's **template** section, so pages
  without a shader hero never download the ~70 kB bundle. It can't come from a
  scripts section — see the `canopy.scripts` limits above. Two shader heroes on
  one page therefore emit the tag twice, so the script guards its own
  initialisation behind `window.__paperShaderBgInit`.

The section's outer flex container is a **row**, so `items-*` controls the
vertical axis and `justify-*` the horizontal one. With `flex-col` the two swap
and the "bottom left" layouts render top right.

The mount element carries a CSS gradient of the same colours, so the hero still
looks deliberate before the script runs, when WebGL is unavailable, or with
JavaScript off. `prefers-reduced-motion` renders a single still frame (speed 0
also stops the library's animation loop outright).

To add a preset: add an entry to `PRESETS` in `src/js/shader-bg.js` and an
option to the block's `preset` select. Uniform names must match the shader
source exactly — a wrong name only warns at runtime.

## Collections

Ten Collections back the data-driven blocks:

| Handle           | Used by                          | Key fields                                                    |
| ---------------- | -------------------------------- | ------------------------------------------------------------- |
| `brand`          | Header, Footer, both Heros       | name, tagline, logo, logo_light, logo_dark, wordmark, symbol, logo_alt |
| `tour_dates`     | Tour Dates, Tickets, Past Gigs   | date, date_label, city, venue, ticket_url, status, featured, order |
| `releases`       | Discography                      | title, artwork, release_date, type, description, streaming links, featured, order |
| `merch`          | Merch                            | title, image, image_hover, price, compare_price, url, type, status, featured, order |
| `gallery`        | Gallery                          | image, caption, alt_text, credit, link, tag, featured, order   |
| `members`        | Band Members                     | name, role, image, image_alt, quote, bio, instruments, hometown, joined, socials, featured, order |
| `history`        | History / Timeline               | year, title, description, body, image, link, link_label, date, featured, order |
| `downloads`      | Downloads                        | title, artwork, file, external_url, format, file_size, description, release_date, type, featured, order |
| `articles`       | Articles & Press                 | title, excerpt, image, source, author, date, url, body, type, featured, order |
| `press_releases` | Articles & Press                 | title, date, excerpt, body, image, file, url, source, contact_name, contact_email, type, featured, order |

The content blocks expose the collection as a **select**, plus sorting,
filtering and a limit. Tour Dates can hide past shows, Discography filters by
release type, Merch filters by product type and can hide sold-out items,
Gallery filters by tag, and Downloads filters by type.

### Three blocks share `tour_dates`

Tour Dates, Tickets and Past Gigs all read the same collection and slice it
differently: upcoming shows, the *next* show, and everything already played.
Nothing needs entering twice — a date moving into the past moves itself from
one block to the other.

### The gallery falls back to its uploads

The Gallery block kept its eight upload slots after moving to a collection, as
a second source *and* as a fallback: when the selected collection is empty it
renders the uploads instead. A block built before the collection existed keeps
working, and switching an existing block over is just a matter of filling the
collection.

Its **Appearance** tab is where the look is set — columns (2–5), gap, image
shape, corners, treatment (mono / sepia / punch), hover effect, and whether
captions sit below the image, over it, or fade in on hover.

### One block, two press collections

Articles & Press reads either `articles` (news and coverage) or
`press_releases`, because the fields the layouts touch are the same in both.
The **press** layout additionally picks up the PDF and press contact that only
press releases carry.

An item with an external link points at it; one without shows its own `body`
in a `<details>` panel. That keeps a release readable on the page without a
detail route, at the cost of not having a URL of its own — add a route pattern
if individual releases need to be linked to directly.

### Members and the lead singer

The `members` collection has a **Front and centre** flag rather than a separate
"lead singer" concept. The default sort puts flagged members first, and the
**lead** and **profile** layouts pull the first member out of the list to show
large, with the biography rendered in full.

### The brand collection

`brand` is used as a **singleton — the first entry wins**. It holds the artist
name and every logo variant in one place so blocks can pull a mark without
re-uploading it, and so changing the name once changes it everywhere.

`views/components/brand.html` provides the helpers. Macros can only return
strings, so they hand back a URL or a name rather than an object — always
`|trim` the result before testing it:

```canvas
{% import 'components/brand' as brand %}
{% set b = (cms.collection('brand') ?? [])|first %}
{% set logo = brand.logo_url(b, settings.logo_variant)|trim %}
```

Header, Footer and both Hero blocks share the same three-way control: **From the
Brand collection** / **Upload one here** / **Text only**, with a variant picker
(primary, light, dark, wordmark, symbol). Each variant falls back to the primary
logo, and a missing logo falls back to text, so a half-filled collection still
renders something sensible.

Whichever source is selected also wins for the *name*, each falling back to the
other. Otherwise typing in a block's own "Logo text" field would appear to do
nothing whenever the collection had a name.

**Never write `(cms.collection('brand') ?? [])|first ?? {}`.** An empty hash
literal after `??` is a compile-time error in Canvas, and Canopy swallows it
into a blank section with no message. A null entry is safe to read fields from,
so the default isn't needed.

**Collections can take a variable handle — forms can't.** `cms.collection(handle)`
works with a variable, which is why these blocks offer a real picker instead of
the one-branch-per-handle workaround `views/components/form.html` needs.

**Guard the result.** A handle with no matching collection returns `null`, and
piping `null` into `|filter` throws — which Canopy swallows, blanking the whole
section with no message. Both blocks use `cms.collection(...) ?? []` so a missing
collection shows the block's empty-state text instead.

Collection `checkbox` fields are multi-option groups, not booleans, so the
`featured` flags are Yes/No selects — hence `entry.featured == 'Yes'`.

### List-based blocks

Tour Dates (in manual mode), Press Quotes and FAQ use a repeatable `list`
setting where each item is a single line with `|` separating the fields:

```
Tour Dates   Date | City | Venue | Ticket link | Badge
Press Quotes Quote | Source | Link
FAQ          Question | Answer
History      Year | Title | Description
Past Gigs    Year | Date | City | Venue | Link
Tickets      Name | Link | Note          (the ticket outlets list)
Social Links Name | Link | Note
```

The Social Links block is entirely list-driven for the same reason: a new
platform is a new line rather than a template change. Its badge is the
platform's initial, not a brand glyph — it always matches whatever an editor
types, needs no icon library, and takes the theme's colours. The Footer block
covers the case where a fixed set of named platforms is wanted instead.

Leave a field empty to omit it — `Mon 17 Aug | Glasgow, UK | Barrowland | | Sold out`
renders a "Sold out" badge instead of a ticket button.

Tour Dates normalises both its sources into one row shape before rendering, so
the three layouts only ever deal with one structure.

### Forms — a Canvas constraint worth knowing

The `{% form %}` tag **only accepts a literal string handle**. `{% form handle %}`
with a variable is a *compile-time* error that 500s the page — and because
Canopy catches errors per block, the surrounding section renders completely
blank with no message. An `{% if %}` guard does not help, since the tag fails at
compile time even in an unreachable branch.

So `views/components/form.html` has one branch per supported form with the
handle written literally — `contact`, `newsletter` and `fan_club`. To add a
fourth, copy a branch and change the literal, then add the option to the
`form_handle` select on the Contact and Fan Club blocks.

The Fan Club block uses the `fan_club` form (name, email, location, interests,
consent) and adds a perks list beside it, in four styles. Its **Form** setting
can drop back to the plain newsletter signup when a full registration is too
much to ask for.

Each branch is also wrapped in `cms.form('...')`, which returns falsy for a
handle that doesn't exist in the dashboard. That keeps the rest of the section
visible and prints which handle is missing, instead of silently rendering nothing.

## Layouts

| Layout                     | Use for                                              |
| -------------------------- | ---------------------------------------------------- |
| `layouts/landing.html`     | Homepage / campaign pages — blocks only, full width  |
| `layouts/page.html`        | Inner pages — page title header, then blocks         |

Both render the `main` block area. `views/templates/default.html` renders the
shared `theme`, `header` and `footer` areas plus the matching `canopy.head` /
`canopy.scripts` calls.

## Local development

```bash
npm run dev      # Tailwind/Parcel watch
courier dev      # https://localhost:8080
```

**`courier dev` only picks up a file when its contents change while the server
is running.** Anything edited before it started is served from its previous
state, and `touch` won't do it — the watcher keys off content, not mtime. If a
block looks stale, re-save it (or restart the server *and* re-save).

Blocks can be previewed before any page exists by dropping
`{{ canopy.render('hero') }}` into a template — `canopy.render` renders a block
template with its default settings, and a second argument overrides them:
`{{ canopy.render('hero-shader', { preset: 'warp', shape: 'stripes' }) }}`.

Note that `canopy.render` validates `select`/`radio` overrides against the
declared options, so passing a value that isn't in the list falls back to the
default rather than erroring.

## Working on the CSS

```bash
npm run dev
```

Tailwind scans `views/**/*.{html,canvas}` via the `@source` directive in
`src/styles/global.css`. Any new class written in a block needs a rebuild
(`npm run build`) before it appears in `public/styles/global.css`.

Avoid building class names from settings (`text-{{ settings.align }}`) — Tailwind
can't see those. Write full class names in a `{% set %}` map instead, the way
every block here does.

The marquee block defines its own `.marquee` CSS in a `{% canopy head %}`
section rather than in `global.css`; don't duplicate it.
