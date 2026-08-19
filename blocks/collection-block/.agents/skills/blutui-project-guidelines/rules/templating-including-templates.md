---
title: Including other templates
impact: HIGH
impactDescription: High Impact (90%) - The Template Engine serves as the critical logic layer, binding HTML elements to Blutui-specific concepts. Strict adherence to this syntax is mandatory for data interactivity; without it, the project will fail to render or process dynamic data.
tags: canvas, variables, tags, filters, functions, tests, expressions, templating festures
---

The `include` function is useful to include a template and return the rendered content of that template into the current one.

```canvas
{{ include('sidebar') }}
```

Included templates automatically inherit the data context of their parent. This ensures that any variables defined in your main template are immediately accessible within the included file without extra configuration.

```canvas
{% for box in boxes %}
  {{ include('render_box') }}
{% endfor %}
// The included template `render_box` is able to access the box variable.
```

Templates in subdirectories can be accessed with a slash:

```canvas
{{ include('sections/articles/sidebar') }}
```

Use `include` to pull reusable components from the `views/components/` directory into layouts:

```canvas
{{ include('components/header') }}
{{ include('components/hero') }}
{{ include('components/footer') }}
```
