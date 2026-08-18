---
title: Rendering Blocks
impact: CRITICAL
impactDescription: Layouts must render block areas for editors' blocks to appear at all, and must pair areas with head/scripts calls or block CSS/JS never loads.
tags: block areas, canopy.blocks, canopy.render, canopy.head, canopy.scripts
---

## Rendering Blocks

Blocks are rendered in **block areas**. An area is scoped to the page it appears on by default, or shared across the whole site.

### `canopy.blocks(handle, options?)` — render a block area

```canvas
{{ canopy.blocks(handle, { shared: ... }) }}
```

| Argument            | Description                                                  | Data Type |
| ------------------- | ------------------------------------------------------------- | --------: |
| `handle`            | The block area identifier                                    |    String |
| `shared` (optional) | Set to true to share the area's blocks across the whole site |   Boolean |

Outputs every block editors have added to the area, in the order they arranged them.

**Area scoping:**

- By default an area is **scoped to the current page** — the same `handle` holds different blocks on different pages (`main` on the homepage ≠ `main` on the about page).
- With `{ shared: true }` the area holds **one set of blocks for the whole site** — use for footers, announcement bars, and other global sections. Every page that renders the shared area shows the same blocks.

**Explicit template lists:** instead of options, pass an array of block template names. The templates render in the given order, using editor content where it exists and template defaults where it does not:

```canvas
{{ canopy.blocks('showcase', ['hero', 'features', 'cta']) }}
```

Use this when a page must always show a fixed sequence of sections that editors can still fill in.

### `canopy.head(handle)` and `canopy.scripts(handle)`

```canvas
{{ canopy.head(handle) }}
{{ canopy.scripts(handle) }}
```

- `canopy.head` collects the `{% canopy head %}` sections of every block template used in the area — place it in the page `<head>`.
- `canopy.scripts` collects the `{% canopy scripts %}` sections — place it at the end of the `<body>`.
- Each template's section is included **once per area**, no matter how many blocks use the same template.
- **Use the same `handle` passed to `canopy.blocks`.** A mismatched handle silently outputs nothing. If the area is rendered with an explicit template list, the head/scripts sections for those templates are returned.

### `canopy.render(template, settings?)` — render a template directly

```canvas
{{ canopy.render(template, { ... }) }}
```

| Argument              | Description                                          | Data Type |
| --------------------- | ----------------------------------------------------- | --------: |
| `template`            | The name of the block template                       |    String |
| `settings` (optional) | Setting values to merge over the template's defaults |    Object |

Renders a block template **without any editor content** — the template renders with its default setting values, and anything passed in `settings` overrides those defaults:

```canvas
{{ canopy.render('hero') }}
{{ canopy.render('hero', { description: 'A custom description' }) }}
```

Use it when a section should always appear with fixed content, or to preview a block template while building it. Note that editors cannot edit content rendered this way — if editors should manage it, use a block area instead.

### Layout example

```canvas
<!DOCTYPE html>
<html>
  <head>
    <title>My Site</title>
    {{ canopy.head('main') }}
  </head>
  <body>
    {{ canopy.blocks('main') }}
    {{ canopy.blocks('footer', { shared: true }) }}
    {{ canopy.scripts('main') }}
  </body>
</html>
```

This renders the page-scoped `main` area, a site-wide shared `footer` area, and the head/scripts sections for the blocks used in `main`.

### Editing in the dashboard

Once a layout renders a block area, the page can be opened in the Canopy editor from the dashboard. Every block template in `views/canopy/` is available to add; editors fill in each block's settings and drag blocks into order without touching code. If a layout renders no block area, editors have nowhere to add blocks — the area call in the layout is what makes a page editable.

Reference: [canopy.blocks](https://docs.blutui.com/canvas/functions/canopy/canopy-blocks) · [canopy.render](https://docs.blutui.com/canvas/functions/canopy/canopy-render) · [canopy.head](https://docs.blutui.com/canvas/functions/canopy/canopy-head) · [canopy.scripts](https://docs.blutui.com/canvas/functions/canopy/canopy-scripts)
