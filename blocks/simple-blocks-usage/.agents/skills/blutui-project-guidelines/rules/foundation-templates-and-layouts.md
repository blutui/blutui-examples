---
title: Templates and Layouts
impact: CRITICAL
impactDescription: Functional Impact - Blutui templates and layouts govern core project logic. Deviating from these structures results in broken inheritance and rendering failures, preventing the project from functioning as intended.
tags: project, file structure, views, templates, layouts, components
---

## Layouts and Templates

Blutui uses two distinct layers to build pages. Understanding the difference is critical — they serve different audiences and must not be confused.

### Templates (`views/templates/`)

A template is the **outer HTML shell** of the site — the `<html>`, `<head>`, global scripts, and any elements that appear on every single page (e.g. a site-wide `<nav>` or `<footer>`). Templates use `{% block %}` tags to mark regions where layouts can inject page-specific content.

- Developers write and maintain templates. **Editors never see or interact with templates directly.**
- A template can extend another template, but layouts cannot extend each other.
- Think of a template as infrastructure — it changes rarely and affects every page at once.

### Layouts (`views/layouts/`)

A layout extends a template and fills in its `{% block %}` regions with page-specific structure. Each layout represents one type of page — for example a full-width landing page, a two-column blog post, or a contact page.

- **Layouts are the only way to create pages in Blutui.** Every page a content editor creates in the dashboard must be backed by a layout file.
- When an editor creates a page, they pick a layout from a list. Every layout file a developer adds becomes a new option in that list.
- **Never create a `pages/` directory.** All page content belongs in `views/layouts/`.
- When referencing a layout in any Blutui MCP tool (`layout`, `post_layout`, `blog_layout`), the path must be relative to `views/` — e.g. `layouts/about.html`, not `views/layouts/about.html`.

### Page Creation Workflow

Follow these steps every time a new page is needed:

1. **Check for the layouts folder:** If `views/layouts/` does not exist, create it. If it already exists, proceed.
2. **Create the layout file:** Create a new `.html` file inside `views/layouts/` (e.g., `views/layouts/about.html`).
3. **Extend a template:** The layout must extend a template using `{% extends 'templates/default.html' %}`.
4. **Build with components:** Create reusable UI fragments in `views/components/` and include them in the layout using `{{ include('components/hero.html') }}`.
5. **Register the page via MCP:** Use the Blutui MCP `create_page` tool to create the page in the dashboard, setting the layout path relative to `views/` (e.g., `layouts/about.html`).

**Example:** A layout file at `views/layouts/about.html`

```canvas
{% extends 'templates/default.html' %}

{% block body %}
  {{ include('components/hero.html') }}

  <section>
    <h1>About Us</h1>
    <p>Welcome to our about page.</p>
  </section>

  {{ include('components/cta.html') }}
{% endblock %}
```

Reference: [How to create a layout](https://docs.blutui.com/guides/create-layout)
