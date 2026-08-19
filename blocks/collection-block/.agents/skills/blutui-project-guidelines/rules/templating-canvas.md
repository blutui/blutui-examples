---
title: Canvas
impact: CRITICAL
impactDescription: High Impact (90%) - The Template Engine serves as the critical logic layer, binding HTML elements to Blutui-specific concepts. Strict adherence to this syntax is mandatory for data interactivity; without it, the project will fail to render or process dynamic data.
tags: canvas, variables, tags, filters, functions, tests, expressions, templating features
---

Canvas serves as the template engine for Blutui, combining HTML, CSS, and JavaScript with unique Canvas logic to create fully customized project designs.

- The template is a regular text file. It can generate any text-based format (HTML, XML, CSV, LaTeX, etc.). The file extension is ".canvas".
- A template contains variables, tags, filters, functions, tests, expressions and other templating features, which get replaced with values when the template is evaluated.

**Example**

```canvas
<!DOCTYPE html>
<html>
  <head>
    <title>My Webpage</title>
  </head>

  <body>
    <ul id="navigation">
      {% for item in navigation %}
        <li><a href="{{ item.href }}">{{ item.caption }}</a></li>
      {% endfor %}
    </ul>

    <h1>My Webpage</h1>
    {{ a_variable }}
  </body>
</html>
```

- There are two kinds of delimiters:
  - {% ... %}: Used for executing statements.
  - {{ ... }} : Used for printing values to the rendered page.

### Blocks tag: `blocks`

Blocks are used for inheritance and act as placeholders and replacements at the same time.

A block provides a way to change how a certain part of a template is rendered but it does not interfere in any way with the logic around it.

Canvas allows to add the name of the block after the end tag for better readability.

**Example:** Incorrect way to use blocks

```canvas
{# base.html #}

{% for post in posts %}
  {% block post %}
    <h1>{{ post.title }}</h1>
    <p>{{ post.body }}</p>
  {% endblock %}
{% endfor %}
```

**Example:** Correct way to use blocks

A child template looks like this

```canvas
{# child.html #}

{% extends 'base.html' %}

{% block post %}
  <article>
    <header>{{ post.title }}</header>
    <section>{{ post.text }}</section>
  </article>
{% endblock %}
```

A parent template looks like this

```canvas
{% for post in posts %}
  <article>
    <header>{{ post.title }}</header>
    <section>{{ post.text }}</section>
  </article>
{% endfor %}
```

**Example:** a block included within an if statement

```canvas
{% if posts is empty %}
  {% block head %}
    {{ parent() }}
    // parent function renders contents in the parent block

    <meta name="robots" content="noindex, follow">
  {% endblock head %}
{% endif %}
```

### Template Inheritence

Maximize your workflow with template inheritance. Instead of duplicating code, build a single base template for common site features in `views/templates/default.html`. Use `blocks` to define areas where child templates can inject specific content, ensuring a consistent structure across every page.

**Example**: Define a base.html template for a two-column page.

```canvas
<!DOCTYPE html>
<html>
  <head>
    {% block head %}
      <link rel="stylesheet" href="style.css" />
      <title>{% block title %}{% endblock %} - My Webpage</title>
    {% endblock %}
  </head>

  <body>
    <div id="content">{% block content %}{% endblock %}</div>
    <div id="footer">
      {% block footer %}
        &copy; Copyright 2011 by <a href="http://domain.invalid/">you</a>.
      {% endblock %}
    </div>
  </body>
</html>
```

In this example, the block tags define four blocks that child templates can fill in. All the block tag does is to tell the template engine that a child template may override those portions of the template.

A child template might look like this:

```canvas
{% extends 'base.html' %}

{% block title %}Index{% endblock %}

{% block head %}
  {{ parent() }}
  <style type="text/css">
    .important { color: #336699; }
  </style>
{% endblock %}

{% block content %}
  <h1>Index</h1>
  <p class="important">
    Welcome to my awesome homepage.
  </p>
{% endblock %}
```

The `extends` tag can be used to extend a template from another one. Canvas does not support multiple inheritance.

- Use the search_blutui_documentation tool in Blutui MCP to find more information on available tags, filters, functions, tests, expressions and other templating festures.

### Composing Layouts with Components

Always follow the 3-tier pattern when building pages:

1. **Template** (`templates/default.html`) — Defines the overall HTML structure with `block` placeholders.
2. **Layout** (`layouts/about.html`) — Extends the template using `{% extends %}`, fills `block` content, and includes components.
3. **Component** (`components/hero.html`) — A reusable UI fragment included via `{{ include() }}`.

**Example:** Complete 3-tier composition

Template (`views/templates/default.html`):

```canvas
<!DOCTYPE html>
<html>
  <head>
    {% block head %}
      <title>{% block title %}{% endblock %}</title>
    {% endblock %}
  </head>
  <body>
    {{ include('components/header.html') }}
    {% block content %}{% endblock %}
    {{ include('components/footer.html') }}
  </body>
</html>
```

Component (`views/components/hero.html`):

```canvas
<section>
  <h1>{{ heading }}</h1>
  <p>{{ subheading }}</p>
</section>
```

Layout (`views/layouts/about.html`):

```canvas
{% extends 'templates/default.html' %}

{% block title %}About Us{% endblock %}

{% block content %}
  {{ include('components/hero.html') }}
  <article>
    <p>Page content goes here.</p>
  </article>
{% endblock %}
```

### Image URLs

Use the `image_url()` filter to optimise images served from Blutui. Always prefer `webp` format and set an explicit width:

```canvas
<img src="{{ entry.image | image_url({ width: 800, format: 'webp' }) }}" alt="{{ entry.title }}">
```

Available options:

| Option   | Values                    | Description                        |
| -------- | ------------------------- | ---------------------------------- |
| `width`  | integer (px)              | Resize to this width               |
| `height` | integer (px)              | Resize to this height              |
| `format` | `webp`, `jpg`, `png`      | Convert to this format             |

Never render a raw image URL from a collection or blog field without passing it through `image_url()`.

Reference: [Link to documentation](https://docs.blutui.com/guides/what-is-blutui-canvas)
