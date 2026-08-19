---
title: Legacy Canopy Elements (Deprecated)
impact: LOW
impactDescription: Reference for maintaining existing projects that still use deprecated cms_* element functions, and for migrating them to Canopy Blocks. Never use these in new work.
tags: deprecated, cms elements, migration
---

## Legacy Canopy Elements (Deprecated)

> **Deprecated:** Canopy elements are replaced by Canopy Blocks, which let editors manage whole sections instead of individual fields. Use block templates for all new work. This reference exists for maintaining and migrating existing projects.

Canopy elements are inline functions placed directly in layouts to make individual fields editable. Each element requires a **unique handle** as its first argument (unique within each page), and their content is **page-specific**.

### Element reference

| Function      | Purpose                    | Arguments (after `name`)                              |
| ------------- | --------------------------- | ------------------------------------------------------ |
| `cms_text`    | Editable text              | `value`, `class`                                      |
| `cms_heading` | Editable heading (h1–h6)   | `element`, `value`, `class`                           |
| `cms_image`   | Editable image (`<img>`)   | `url`, `alt_text`, `class`                            |
| `cms_button`  | Editable link as button    | `text`, `url`, `opens_new_tab`, `class`               |
| `cms_list`    | Editable ol/ul             | `ordered`, `items` (array of strings), `class`        |
| `cms_quote`   | Editable blockquote        | `value`, `cite`, `class`                              |
| `cms_code`    | Editable code block        | `value`, `class`                                      |

Example of existing usage:

```canvas
{{ cms_heading('heading-hero', {
  element: 'h1',
  value: 'Welcome to Our Site',
  class: 'text-3xl md:text-5xl font-semibold'
}) }}
```

### Migrating elements to blocks

Group the `cms_*` elements that form one visual section into a single block template, converting each element to a setting:

| Legacy element | Block setting type                                               |
| -------------- | ----------------------------------------------------------------- |
| `cms_text`     | `text` (single line) or `textarea` / `richtext` (longer content) |
| `cms_heading`  | `heading`                                                        |
| `cms_image`    | `file`                                                           |
| `cms_button`   | `url`                                                            |
| `cms_list`     | `list`                                                           |
| `cms_quote`    | `text` for the quote plus `text` for the citation                |
| `cms_code`     | `textarea`                                                       |

Migration steps:

1. Identify the section in the layout built from `cms_*` calls.
2. Create a block template in `views/canopy/` with equivalent settings; carry the elements' default values into setting `default`s, and the section's markup (including CSS classes) into the template section.
3. Replace the section in the layout with a block area (`canopy.blocks`) plus `canopy.head`/`canopy.scripts`.
4. Re-enter existing editor content as block settings in the Canopy editor — element content does not transfer automatically.

Reference: [Canopy input types documentation](https://docs.blutui.com/docs/canopy/canopy-input-types)
