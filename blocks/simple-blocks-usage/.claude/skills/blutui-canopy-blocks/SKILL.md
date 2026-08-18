---
name: blutui-canopy-blocks
description: Build Blutui Canopy Blocks — reusable page-section templates that content editors add, fill in, and arrange in the Canopy editor. Use this skill whenever creating or editing block templates (.canvas files in views/canopy/), writing {% canopy %} config/template/head/scripts sections, defining block settings, rendering block areas with canopy.blocks, canopy.render, canopy.head, or canopy.scripts, building nested/parent blocks (galleries, sliders, accordions, tabs) with the children config or canopy.children, canopy.child, or canopy.childList, or migrating deprecated cms_* Canopy elements to blocks. Always load this skill when the user mentions Canopy blocks, block templates, block areas, nested blocks, child blocks, slides, gallery items, accordion items, editable sections, the Canopy editor, or making part of a Blutui page editable — even if they don't say "block" explicitly.
license: MIT
metadata:
  author: Blutui
  version: '1.0.0'
---

# Blutui Canopy Blocks

Canopy Blocks let you build entire page sections as reusable templates. Developers define what a section can look like; content editors add blocks to a page, fill in their settings, and arrange them in the Canopy editor. This keeps a clear separation between code and content.

Canopy Blocks **replace the deprecated `cms_*` Canopy elements** (`cms_text`, `cms_heading`, `cms_image`, etc.). Always use block templates for new work.

## Quick Start

Block templates are single `.canvas` files in `views/canopy/`. A minimal block:

```canvas
{% canopy config %}
{
    "title": "Hero",
    "settings": [
        { "name": "heading", "type": "heading", "default": { "value": "Welcome", "element": "h1" } },
        { "name": "description", "type": "textarea" }
    ]
}
{% endcanopy %}

{% canopy template %}
<section>
  <{{ settings.heading.element }}>{{ settings.heading.value }}</{{ settings.heading.element }}>
  <p>{{ settings.description }}</p>
</section>
{% endcanopy %}
```

Rendered in a layout via a block area:

```canvas
<head>{{ canopy.head('main') }}</head>
<body>
  {{ canopy.blocks('main') }}
  {{ canopy.scripts('main') }}
</body>
```

## Rule Index

Load the rule files that match your task. Load ALL that apply:

| Task                                                        | Load                        |
| ----------------------------------------------------------- | ---------------------------- |
| Creating/editing a block template, config, or sections     | `rules/block-templates.md`  |
| Defining settings (types, defaults, tabs/groups)           | `rules/settings.md`         |
| Rendering blocks in layouts (areas, head/scripts, shared)  | `rules/rendering.md`        |
| Parent blocks with child blocks (galleries, sliders, accordions) | `rules/nested-blocks.md` |
| Designing blocks, build workflow, common patterns          | `rules/patterns.md`         |
| Maintaining or migrating deprecated `cms_*` elements       | `rules/legacy-elements.md`  |

## Core Rules (Always Apply)

1. **One block template per `.canvas` file in `views/canopy/`** — never define blocks anywhere else. The filename becomes the template's name unless the config sets one.
2. **Config must be strictly valid JSON** — double quotes, no trailing commas, no comments. Settings with a missing `name`, missing `type`, or unknown `type` are **silently ignored**, so a typo fails without an error.
3. **Give every setting a sensible `default`** so blocks look complete the moment an editor adds them.
4. **Guard object and array setting values** (`url`, `file`, `list`, `media-sources`) with `{% if %}` / `{% for %}` before rendering dependent markup.
5. **Always guard `collection` and `entry` setting values** — deleted content resolves to `null` (single `entry`, `collection`) or `[]` (`multiple` entry select), so unguarded templates break.
6. **Output `richtext` values with the `raw` filter** — they are stored as HTML.
7. **Pair every block area with `canopy.head` and `canopy.scripts` using the same handle** — otherwise blocks' CSS and JS never load.
8. **Nested blocks: every parent template needs exactly one plain `{{ canopy.children() }}` call** (filtered/indexed/childList renders are display-only — without the plain call editors cannot add or manage children), and every child template's config needs an explicit `"name"` so it registers under the key `allow` lists and filters expect.
9. **Choose the right tool:** blocks for editor-composed sections; `{ shared: true }` areas for global sections (footers); Collections for structured, queryable data (blog posts, products) — surfaced in blocks via the `collection` and `entry` setting types.
10. **Never use deprecated `cms_*` element functions in new work** — build a block template instead.
