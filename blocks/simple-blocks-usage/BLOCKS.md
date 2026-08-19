# Schweppes brand site: Canopy Blocks

Block system: 15 blocks and 3 child blocks across a home
page and a product page. Every block ships with the design's own copy and
imagery as defaults, so a page looks finished the moment a block is added and
editors only change what they want to change.

Nothing here is theme-driven or collection-driven. Each block owns its own
markup and its own settings, which makes it a good place to see how a single
`config` / `template` pair fits together before reaching for the larger patterns
in [`../highly-editable-blocks`](../highly-editable-blocks/BLOCKS.md).

## How a block is put together

One `.canvas` file in `views/canopy/` with two sections: a JSON `config` that
declares what editors can change, and a `template` that renders it.

```canvas
{% canopy config %}
{
    "title": "Full width image",
    "name": "image_band",
    "settings": [
        { "name": "image", "type": "file", "label": "Image", "accept": "image/*" }
    ]
}
{% endcanopy %}

{% canopy template %}
{% set band = settings.image.path|default(asset('images/kiwi-lime-lifestyle.png')) %}
<img src="{{ band | image_url({ width: 1600, format: 'webp' }) }}" alt="" />
{% endcanopy %}
```

**The handle comes from `name`, not the filename.** `image-band.canvas`
registers as `image_band`, which is what the layout lists. Every block here sets
an explicit `name` for that reason.

Blocks with more than a handful of settings group them with `"tab"`: Content,
Media, Style, Table or Reviews depending on the block. Blocks with three or four
settings skip tabs entirely.

## The blocks

### Home page (`views/layouts/home.html`)

| Block                 | Handle        | What it is                                                             |
| --------------------- | ------------- | ---------------------------------------------------------------------- |
| Hero                  | `hero`        | Full bleed headline over a photo, with a backdrop layer and scroll cue |
| Product showcase      | `products`    | Category tabs plus a one-at-a-time product carousel (nested children)  |
| Recipes feature       | `recipes`     | Split section with a display heading and the angled "Learn more" pill  |
| Tradition strapline   | `tradition`   | Centred strapline over a silver background, with a signature lockup    |
| Heritage intro        | `heritage`    | Green panel with a portrait bleeding off the right edge                |
| Lightning in a Bottle | `lightning`   | Narrative section (shared story component)                             |
| Royal Warrant         | `warrant`     | Narrative section, blue panel with a portrait cut-out                  |
| Great Exhibition      | `exhibition`  | Narrative section, full bleed panel with an insignia overlay           |
| Advertising story     | `advertising` | Plum section with a rotated campaign photo and an inset crop           |
| Schweppes Today       | `today`       | Narrative section closing the page, with a signature                   |

### Product page (`views/layouts/product.html`)

| Block                   | Handle          | What it is                                                                 |
| ----------------------- | --------------- | -------------------------------------------------------------------------- |
| Product hero            | `product_hero`  | Headline and rich text, with the pack shot repeated as an overlapping trio |
| Tasting notes           | `tasting_notes` | Three-column grid of notes (nested children)                               |
| Full width image        | `image_band`    | Edge-to-edge lifestyle image at one of three heights                       |
| Nutritional information | `nutrition`     | Product image beside a nutrition table (nested children)                   |

### Not placed by default

| Block          | Handle  | What it is                                                             |
| -------------- | ------- | ---------------------------------------------------------------------- |
| Heritage story | `story` | The narrative section with all of its presentation exposed as settings |

`story` is the general form of the four narrative sections on the home page. Add
it anywhere a new heritage-style section is wanted without writing a block.

## Every setting has a fallback

Blocks read an upload if there is one and drop back to a bundled image
otherwise:

```canvas
{% set hero_image = settings.image.path|default(asset('images/hero-kiwi-lime.png')) %}
<img src="{{ hero_image | image_url({ width: 1600, format: 'webp' }) }}" alt="" />
```

Two details worth copying:

- A `file` setting is an object, so the path is `settings.image.path`, not
  `settings.image`. Passing the object straight to a filter renders nothing
  useful.
- The fallback is `asset('images/...')` from `public/images`, and the result
  goes through `image_url` either way, so uploads and bundled defaults are
  resized and converted to WebP identically.

Text settings follow the same idea: their `default` in the config is the copy
from the design, and the template guards each one with `{% if %}` so clearing a
field removes it cleanly rather than leaving an empty paragraph.

## Five blocks, one story component

`views/components/story-section.html` holds the markup for the narrative
sections. `story`, `lightning`, `warrant`, `exhibition` and `today` all include
it and differ only in what they pass:

```canvas
{% set story_style = { theme: 'blue', image_side: 'right', media_style: 'panel', show_band: false, emphasis_size: 'regular' } %}
{% set story_image = asset('images/warrant-bg-blue.png') %}
{% set story_overlay = asset('images/king-william-iv-blue.png') %}
{{ include('components/story-section.html') }}
```

| `story_style` key | Values                                                  |
| ----------------- | ------------------------------------------------------- |
| `theme`           | `light`, `blue`, `plum`, `green`                        |
| `image_side`      | `left`, `right`                                         |
| `media_style`     | `contained`, `panel` (panel bleeds to the section edge) |
| `show_band`       | Bubbles band across the top of the section              |
| `emphasis_size`   | `regular`, `large`                                      |

The component reads content from `settings`, which is the _including block's_
settings, and presentation from the variables set just above the include. That
split is the whole trick: the four home page sections hard-code their look and
expose only copy and images to editors, while `story` maps the same keys onto
Style-tab settings so an editor picks the theme, side and treatment themselves.

Images resolve in the same layered way: an editor's upload wins, then the
`story_image` / `story_overlay` / `story_signature` defaults the block sets, and
the bubbles band falls back to `images/bubbles-top-bg.png` inside the component.

## Nested blocks

Three blocks own repeatable children, each in a folder named after the parent:

| Parent          | Child                       | Repeats                                                         |
| --------------- | --------------------------- | --------------------------------------------------------------- |
| `products`      | `products/item.canvas`      | One product (pack shot, rating, nutrition summary, share links) |
| `nutrition`     | `nutrition/row.canvas`      | One `<tr>` of the nutrition table                               |
| `tasting_notes` | `tasting_notes/note.canvas` | One tasting note card                                           |

The parent declares what may go inside it and what an editor gets on day one:

```canvas
"children": {
    "allow": ["nutrition/row"],
    "default": [
        { "block": "nutrition/row", "data": { "nutrient": "Energy", "serving": "0 kJ / 0 Cal", "hundred": "0 kJ / 0 Cal" } }
    ]
}
```

Children need an explicit `name` in their own config too. `nutrition/row.canvas`
sets `"name": "row"` so it registers as `nutrition/row` and matches the `allow`
list; without it the handle would be slugged from the title and the filter would
silently stop matching.

Each parent renders `{{ canopy.children() }}` exactly once. That single plain
call is what gives editors the add/reorder affordance, so the child markup is
kept to the smallest useful unit: `nutrition/row` renders a bare `<tr>` and the
parent owns the `<table>`, `<thead>` and column headings.

`products` also uses `canopy.childList()`, but only to count children and draw
one carousel dot each. Reading the list for chrome while still emitting one
plain `canopy.children()` for the content itself is the pattern to follow when a
parent needs to know about its children.

## The product showcase

The only block with behaviour. Its `{% canopy scripts %}` section handles two
things:

**Tabs and dots.** Each `products/item` writes its Category onto the article as
`data-product-category`, and the tab bar comes from a `list` setting on the
parent. Clicking a tab filters to the children whose category matches (compared
case-insensitively and trimmed), and the dots step through whatever is left.
Every tab stays visible even when it has no products yet, but the block opens on
the first tab that actually has something to show, so a half-populated site
never loads onto an empty panel. If a category is genuinely empty, an inline
message replaces the carousel rather than leaving a blank gap.

Clearing the `categories` list hides the tab bar entirely and shows every
product.

**Share links.** The share buttons are rendered as `href="#"` and rewritten on
load, because the URL to share is only known in the browser. The icons are
inline SVG paths held in a small array in the template, so there is no icon
dependency to install.

The script scopes itself to each `[data-products]` root and bails out if the
track is missing, so two showcases on one page do not interfere and a partly
edited block cannot throw.

## Layouts and areas

Both layouts extend `views/templates/default.html` and render a fixed sequence
in the `main` area:

```canvas
{{ canopy.blocks('main', ['hero', 'products', 'recipes', ...]) }}
```

Passing the list gives a new page the full design straight away, in order, while
leaving every block editable and re-orderable afterwards. `default.html` pairs
the area with `canopy.head('main')` in the `<head>` and `canopy.scripts('main')`
before `</body>`, which is what carries the product showcase script onto the
page.

The header and footer are ordinary components, not blocks. They render the
`main` and `footer` menus from the dashboard through `cms.menu()`, so navigation
is managed there rather than in block settings.

## Styling

Brand colours, both fonts and the shared helpers live in
`src/styles/global.css`:

- `@theme` defines `heritage`, `plum`, `warrant`, `silver`, `olive`, `gold` and
  the rest, used as ordinary Tailwind utilities (`bg-heritage`, `text-plum`).
- `.shell` is the page gutter: max width 1440px, 135px of inline padding from
  `lg` up. Sections handle their own background and let `.shell` align the
  content.
- `.pill-cta` is the angled "Learn more" button, skewed on the wrapper and
  un-skewed on the inner span so the text stays upright.
- `.scroll-cue` bobs, and both it and smooth scrolling are disabled under
  `prefers-reduced-motion`.

Tailwind scans the templates through `@source "../../views"` in `global.css`,
since Canvas files are outside Parcel's entry graph. Class names must be written
in full for that scan to see them: `image-band` picks a height from a `heights`
map and `story-section.html` picks a palette from a `themes` map, rather than
interpolating a setting into a class name.

## Local development

```bash
npm install
npm run dev      # Tailwind/Parcel watch
courier dev      # serves at https://localhost:8080
```

`courier.json` points at the site handle to serve; it is git-ignored, so create
your own with your handle before running `courier dev`.

To preview a block while building it, before any page uses it, render it
directly from a template with its defaults:

```canvas
{{ canopy.render('story') }}
{{ canopy.render('story', { theme: 'plum', image_side: 'right' }) }}
```

Content rendered that way is fixed rather than editable, so it is for previewing
only. Note that `select` and `radio` overrides are validated against the
declared options, and a value that is not in the list falls back to the default
instead of erroring.
