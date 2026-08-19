---
title: Collections
impact: CRITICAL
impactDescription: High Impact (90%) - This section governs the binding between frontend elements and Blutui Data Collections. Failure to configure this correctly results in broken dynamic content and prevents the UI from interacting with stored project data.
tags: data, dynamic, data structure, collections
---

## Collections

Collections are the primary method for managing structured data within Blutui that define reusable data schemas using a wide range of field types.

- Unique handles are mandatory for all collections. The agent must validate handle availability before initiating the creation process.
- The available field types are: "text", "textarea", "richtext", "checkbox", "radio", "select", "email", "phone", "url", "date", "time", "date-time", "color", "file", "number"
- Do not add custom field types.

Collections are designed for structured data modeling. Implement a Collection whenever you need to store multiple entries that share a consistent architecture (e.g., matching keys or data types) to ensure efficient querying and rendering.

In the case, when a collection has a some connection to another collection, the agent can look into linking collections using the search_blutui_documentation mcp tool.

**MCP tools for collections:** `list_collections` → `create_collection`, `list_collection_entries` → `create_collection_entry`. For linking two collections: `list_links` → `create_link`. Always run the `list_*` tool first to validate handles before creating.

### Connect collection data in a template

```canvas
{% set authors = cms.collection('authors') %}
{% set author = authors | first %}
<div class="author-section">
  <img
    src="{{ author.avatar | image_url({ width: 400, format: 'webp' }) }}"
    alt="{{ author.name }}"
  >
  <p>
    <strong>{{ author.name }}</strong>
  </p>
  <div>
    {{ author.bio | raw }}
  </div>
</div>
```

### Common Filters

#### Sorting

Collections with an `order` field should be sorted before rendering. Use the spaceship operator `<=>` for numeric comparison:

```canvas
{% set items = cms.collection('features') | sort((a, b) => a.order <=> b.order) %}
```

Sort by a date field (descending):

```canvas
{% set posts = cms.collection('news') | sort_by('publish_date', true) %}
```

#### Limiting Results

```canvas
{% set featured = cms.collection('people') | slice(0, 3) %}
```

#### Filtering by a Field

```canvas
{% set member = cms.collection('team') | filter(entry => (entry.name | slug) == route.data.name) | first %}
```

#### Image Optimisation

Always transform image fields with `| image_url()` — never render raw image URLs:

```canvas
<img src="{{ entry.image | image_url({ width: 800, format: 'webp' }) }}" alt="{{ entry.title }}">
```

Available options: `width`, `height`, `format` (`webp`, `jpg`, `png`).

#### Rich Text Fields

Richtext fields must use `| raw` to render HTML correctly. Without it the HTML tags will appear as escaped text:

```canvas
<div>{{ entry.body | raw }}</div>
```

### Collection Conventions

- Add an `order` (number) field to any collection that needs manual ordering.
- Use the `| slug` filter when matching a collection entry to a route parameter.

Reference: [Link to documentation](https://docs.blutui.com/docs/collections/getting-started)
