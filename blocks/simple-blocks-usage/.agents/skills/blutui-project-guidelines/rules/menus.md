---
title: Menus
impact: HIGH
impactDescription: Navigation Impact - Menus are the primary way to render site navigation. Incorrect usage breaks header and footer navigation across every page.
tags: menu, navigation, header, footer, dropdown
---

## Menus

Menus are managed in the Blutui dashboard and accessed in templates via `cms.menu('handle')`. Use them for all site navigation — never hardcode nav links in templates.

### Basic Usage

```canvas
{% set nav = cms.menu('main') %}
<ul>
  {% for item in nav.items %}
    {% if item.active %}
      <li>
        <a href="{{ item.href }}" {% if item.opens_new_tab %}target="_blank" rel="noopener"{% endif %}>
          {{ item.label }}
        </a>
      </li>
    {% endif %}
  {% endfor %}
</ul>
```

Always check `item.active` before rendering a menu item. Items with `active: false` have been hidden by an editor in the dashboard and must not appear on the site.

### Menu and Item Fields

**Menu object:**

| Field | Description |
| ----- | ----------- |
| `name` | Menu name |
| `handle` | Menu handle |
| `items` | Array of top-level menu items |

**Menu item fields:**

| Field | Description |
| ----- | ----------- |
| `label` | Display label |
| `href` | Link URL |
| `opens_new_tab` | `true` if link should open in a new tab — render `target="_blank"` |
| `active` | `true` if the item should be visible on the site — skip rendering when `false` |
| `order` | Manual ordering value |
| `items` | Nested child items (for dropdowns) |

### Dropdown / Nested Navigation

Menu items can have children for dropdown menus. Check `item.items` before rendering a dropdown:

```canvas
{% set nav = cms.menu('main') %}
{% for item in nav.items %}
  {% if item.active %}
    {% if item.items %}
      <div>
        <button>{{ item.label }}</button>
        <ul>
          {% for child in item.items %}
            {% if child.active %}
              <li>
                <a href="{{ child.href }}" {% if child.opens_new_tab %}target="_blank" rel="noopener"{% endif %}>
                  {{ child.label }}
                </a>
              </li>
            {% endif %}
          {% endfor %}
        </ul>
      </div>
    {% else %}
      <a href="{{ item.href }}" {% if item.opens_new_tab %}target="_blank" rel="noopener"{% endif %}>
        {{ item.label }}
      </a>
    {% endif %}
  {% endif %}
{% endfor %}
```

### Common Menu Handles

Projects typically have multiple menus for different regions:

```canvas
{% set nav = cms.menu('main') %}       {# Primary navigation #}
{% set footer = cms.menu('footer') %}  {# Footer navigation #}
```

### MCP Workflow

- Run `list_menus` before `create_menu` to avoid duplicates.
- Use `create_menu` to register a new menu in the dashboard.
- After creating a menu, add items via the dashboard or the relevant MCP tool.

Reference: [Add a menu to your project](https://docs.blutui.com/guides/add-menu-to-project)
