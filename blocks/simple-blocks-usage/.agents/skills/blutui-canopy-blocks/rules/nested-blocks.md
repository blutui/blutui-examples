---
title: Nested Blocks
impact: CRITICAL
impactDescription: Parent blocks must render exactly one plain canopy.children() call or editors cannot add or manage children at all, and child configs need explicit names or allow lists and filters silently break.
tags: nested blocks, child blocks, parent blocks, children config, canopy.children, canopy.child, canopy.childList
---

## Nested Blocks

Nested blocks let a block template contain its own child blocks. The parent
(gallery, slider, accordion) defines the wrapper and rules; content editors
add, arrange, and edit children inside it. Children belong to their parent —
stored on it, edited in a nested list under it, deleted with it.

Nesting is one level deep. A child template cannot have children of its own.

### Creating child templates

A block becomes a parent by having a folder named after its file:

```
views/canopy/
├── gallery.canvas        ← parent
└── gallery/
    ├── wide.canvas       ← child
    └── tall.canvas       ← child
```

Child templates are ordinary block files: a config section, a template
section, optional head and scripts sections. They are namespaced under their
parent and hidden from normal Add Block pickers — usable only inside their
parent.

**Always set an explicit `"name"` in a child's config.** Registered names come
from the config `name` (falling back to a slug of the title), NOT the
filename. A child with `"name": "wide"` in the `gallery/` folder registers as
`gallery/wide`; one with only `"title": "Wide Image"` registers as
`gallery/wide-image`, which breaks `allow` lists and filters that expect
`gallery/wide`.

```canvas
{% canopy config %}
{
    "title": "Wide image",
    "name": "wide",
    "settings": [
        { "name": "image", "type": "file", "label": "Image" },
        { "name": "caption", "type": "text" }
    ]
}
{% endcanopy %}

{% canopy template %}
<figure class="col-span-2">
  <img src="{{ settings.image.url }}" alt="{{ settings.caption }}" />
  <figcaption>{{ settings.caption }}</figcaption>
</figure>
{% endcanopy %}
```

### Rendering children in the parent

```canvas
{{ canopy.children() }}                    {# all children, in order — the editable zone #}
{{ canopy.children({only: 'wide'}) }}      {# subset by template; 'wide' matches 'gallery/wide' #}
{{ canopy.children({except: ['wide']}) }}  {# everything but these #}
{{ canopy.child(0) }}                      {# single child by position (0-based) #}

{% for child in canopy.childList() %}      {# custom loop; child has id, template, settings, html #}
    <div class="slide">{{ child.html }}</div>
{% endfor %}
```

`only` and `except` accept a template name or array of names; short names
match namespaced children (`'wide'` matches `gallery/wide`).

**CRITICAL: only the plain `canopy.children()` call creates the editable
zone.** Filtered (`only`/`except`), indexed (`canopy.child(n)`), and
`canopy.childList()` renders are display-only. A parent template without one
plain `canopy.children()` call gives editors no way to add or manage children
at all — not on the canvas and not in the block tree sidebar. Every parent
template must include exactly one plain `canopy.children()`.

A good pattern: a `canopy.childList` loop for a summary strip (thumbnails,
captions, tab labels) plus one plain `canopy.children()` for the editable
content itself.

### The children config

Having the folder is enough to make a block a parent. An optional `children`
key refines the rules — all sub-keys optional:

```json
{
    "title": "Gallery",
    "children": {
        "allow": ["gallery/wide", "cta_banner"],
        "max": 8,
        "default": [
            { "block": "gallery/wide", "data": { "caption": "First item" } },
            { "block": "gallery/tall" }
        ]
    }
}
```

- `allow` — replaces the folder set entirely, and may include shared top-level
  templates (letting a site-wide block be used as a child). A parent with no
  child folder can declare children this way: list existing templates in
  `allow`. A `children` key with no folder and no `allow` accepts nothing.
- `max` — maximum child count, enforced in the editor and on save.
- `min` — accepted but not yet enforced; don't rely on it.
- `default` — children a freshly added parent starts with, ready to edit.
  Each entry names a `block` and can pass `data` for its settings. Explicitly
  deleting all children keeps the list empty — defaults never resurrect.
  Changing `default` later only affects fresh parents, not edited ones.

### Head and scripts

Child templates can have their own `{% canopy head %}` and
`{% canopy scripts %}` sections. They join the parent zone's `canopy.head()`
and `canopy.scripts()` output automatically — deduped once per template, no
matter how many children use it. Put per-child-type CSS/JS there rather than
inline in the child template.

### Editor behavior (for reference)

- Children appear as nested rows under the parent in the block tree, with a
  count badge (`3/8` when `max` is set).
- Children can be added, edited, reordered, and deleted before the parent is
  even saved.
- Children cannot be dragged into a different parent; deleting the parent
  deletes its children.

### Checklist for a new parent block

1. Folder named exactly after the parent file (`gallery.canvas` → `gallery/`).
2. Every child config has an explicit `"name"`.
3. Exactly one plain `{{ canopy.children() }}` in the parent template.
4. `allow`/`max`/`default` set if the design needs constraints or seed content.
5. Names in `allow` and `default` use the full namespaced key
   (`gallery/wide`), matching the children's declared names.
