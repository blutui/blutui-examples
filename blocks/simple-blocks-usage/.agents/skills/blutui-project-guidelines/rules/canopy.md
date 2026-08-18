---
title: Canopy
impact: HIGH
impactDescription: Editor Integration - Canopy Blocks are the primary way content editors compose pages. Developers define block templates; editors add, fill in, and arrange them in the Canopy editor. Missing block areas or invalid config silently breaks the editing experience.
tags: in-page editor, blocks
---

## Canopy

Canopy is Blutui's in-page editor. **Canopy Blocks** are the current mechanism: developers define reusable section templates, and content editors add them to pages, fill in their settings, and arrange them in the Canopy editor.

> The older per-field Canopy elements (`cms_text`, `cms_heading`, `cms_image`, `cms_button`, `cms_list`, `cms_quote`, `cms_code`) are **deprecated**. Never use them in new work — build a block template instead.

### Essentials

- Block templates are single `.canvas` files in `views/canopy/`, made of `{% canopy %}` sections: `config` (JSON: `title`, optional `name` and `settings`), `template` (required Canvas code, receives a `settings` variable), and optional `head` / `scripts` for block-specific CSS/JS.
- The config must be strictly valid JSON (double quotes, no trailing commas); settings with a missing or unknown `name`/`type` are silently ignored. Settings can declare a `tab` and a `group` to organize the editing form.
- Layouts render blocks in **block areas** — page-scoped by default, site-wide with `{ shared: true }` (footers, global sections).
- Blocks can nest **one level**: a folder named after a block file (`gallery.canvas` → `gallery/`) makes it a parent whose child blocks editors manage inside it. The parent template must render exactly one plain `{{ canopy.children() }}`, and every child config needs an explicit `name`.

```canvas
<head>{{ canopy.head('main') }}</head>
<body>
  {{ canopy.blocks('main') }}
  {{ canopy.blocks('footer', { shared: true }) }}
  {{ canopy.scripts('main') }}
</body>
```

| Function                             | Purpose                                          |
| ------------------------------------ | ------------------------------------------------- |
| `canopy.blocks(handle, options?)`    | Render a block area                              |
| `canopy.render(template, settings?)` | Render a block template directly, without editor content |
| `canopy.head(handle)`                | Output head sections for the blocks in an area   |
| `canopy.scripts(handle)`             | Output scripts sections for an area              |

### Core rules

1. Give every setting a sensible `default` so blocks look complete when added.
2. Output `richtext` settings with the `raw` filter; guard object/array values (`url`, `file`, `list`) with `{% if %}` / `{% for %}`.
3. Pair every block area with `canopy.head` and `canopy.scripts` using the **same handle**, or block CSS/JS never loads.
4. Blocks are for editor-composed sections; use `{ shared: true }` areas for global sections and Collections for structured, queryable data.

### Full reference

For the complete guide — block template anatomy, all setting types and value shapes, rendering options, design patterns, and migrating legacy `cms_*` elements — **load the `blutui-canopy-blocks` skill**.

Reference: [Link to documentation](https://docs.blutui.com/docs/canopy/canopy-blocks)
