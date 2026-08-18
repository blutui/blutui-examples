<blutui-project-guidelines>


## File structure

### "/public" directory

Store assets including compiled JS/CSS, images and static PDFs.

### "/views" directory

This folder is the primary environment for UI development. Follow these sub-directory conventions:

- "templates/": Has files with reusable design bases and system views.
  - "default.html": The foundational template for a Blutui project. This file forms the outermost structure of a Blutui project. It features essential sections like the head, where style definitions reside, and the body, where content gets placed. The most efficient way to build upon this file is by using inheritance, capitalising on the block tag.
  - "404.html": A template for handling "Page Not Found" errors.
- "layouts/": The layouts folder is the **only** way to create pages in a project. Each layout file maps to a page registered via the Blutui dashboard or MCP tools. **Do not create a `pages/` directory.** All page content belongs in layout files.
- "components/": Contains atomic, reusable UI fragments. Always create components for repeated UI elements (headers, footers, hero sections, CTAs, cards, etc.) and include them in layouts using `{{ include('components/filename.html') }}`.

Develop the project using a **component-first approach**. Always break the UI into reusable components in `views/components/`. Include components in layouts using `{{ include() }}` and use `{% block %}` tags for template inheritance. This minimizes duplicate work and ensures design updates stay consistent across all project views.

#### Understanding inheritance in Blutui

Hierarchy:

- Parent: templates/default.html (Defines the overall structure).
- Child: layouts/index.html (Extends the template and provides specific page content).

To implement this, ensure the child layout file begins with the `{% extends 'templates/default.html' %}` declaration. Map your content to the parent's placeholders by wrapping your HTML in matching `block` names. Include reusable components within those blocks.

#### Style System Detection

Before generating any HTML or component code, the agent must detect the project's existing style system:

1. Check for `tailwind.config.*` or `postcss.config.*` files in the project root.
2. Check for CSS framework CDN links (e.g., Bootstrap, Bulma) in `views/templates/default.html`.
3. Check for CSS files in the `/public` directory.

- If a style system is found (e.g., TailwindCSS), **always use its utility classes and conventions** in all generated HTML and components.
- If no style system is detected, **ask the user** which style approach they want before generating any HTML.
- Never generate unstyled or bare HTML when a style system is available in the project.

### Migrating a `pages/` Directory

If a `pages/` directory is found in the project, every file in it must be migrated to the Blutui layout system. Follow this sequence for **each file**:

#### URL Mapping

The filename in `pages/` determines the route it serves. Use this mapping to derive the correct layout path and registered URL:

| `pages/` file | Layout file path | Registered URL |
| ------------- | ---------------- | -------------- |
| `index.html` | `views/layouts/home.html` | `/` |
| `about.html` | `views/layouts/about.html` | `/about` |
| `contact.html` | `views/layouts/contact.html` | `/contact` |

**`index.html` is the homepage** — it must be registered at `/`, not `/index`. Name the layout file `home.html` (or another descriptive name) to avoid confusion.

#### Migration Steps (repeat for each file)

1. **Create the layout file** — Copy the page content into the correct path from the table above. Wrap it in the template inheritance structure:

```canvas
{% extends 'templates/default.html' %}

{% block body %}
  {# content from the original page file goes here #}
{% endblock %}
```

2. **Register via MCP** — Run `list_pages` to confirm no conflict, then call `create_page` with:
   - `layout` path relative to `views/` (e.g. `layouts/home.html`)
   - `url` set to the correct registered URL (e.g. `/` for the homepage)

3. **Delete the original file immediately** — Do not proceed to the next file until the current file has been deleted from `pages/`. This step is mandatory, not optional.

4. **After all files are migrated** — Delete the `pages/` directory itself.

**The migration is not complete until the `pages/` directory no longer exists.** If the migration cannot finish in one pass, notify the user of exactly which files remain and their target layout paths.

Reference: [Link to documentation](https://docs.blutui.com/docs/getting-started/folder-structure)

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

---


The `handle` property is **required** and specifies the unique identifier for the Blutui project. Always prompt the user for it, never guess or fabricate.

The `cassette` property determines which project version is active.

**Minimal config:**

```json
{
  "cassette": "default",
  "handle": "project-handle"
}
```

After making changes to the `courier.json`, instruct user to restart their `courier dev` session or the Blutui MCP server if it's running.

Reference: [Courier configuration](https://docs.blutui.com/docs/courier/configuration)

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

---


## Blutui MCP

### Available Tools

**Create**

| Tool | Description |
| ---- | ----------- |
| `create_blog` | Create a blog |
| `create_collection` | Create a collection |
| `create_collection_entry` | Create a collection entry |
| `create_form` | Create a form |
| `create_link` | Create a link between collections |
| `create_menu` | Create a menu |
| `create_page` | Create a page |
| `create_post` | Create a blog post |
| `create_redirect` | Create a redirect |
| `create_route_pattern` | Create a route pattern |
| `create_webhook` | Create a webhook |

**The MCP does not expose `update_*` or `delete_*` tools.** To modify or remove an existing resource, the user must do it from the Blutui dashboard. Do not attempt to update or delete resources via MCP — instruct the user to make the change in the dashboard instead.

**List**

| Tool | Description |
| ---- | ----------- |
| `list_blogs` | List all blogs |
| `list_collections` | List all collections |
| `list_collection_entries` | List all entries in a collection |
| `list_forms` | List all forms |
| `list_links` | List all collection links |
| `list_menus` | List all menus |
| `list_pages` | List all pages |
| `list_posts` | List all blog posts |
| `list_redirects` | List all redirects |
| `list_route_patterns` | List all route patterns |
| `list_submissions` | List all form submissions |
| `list_webhooks` | List all webhooks |

**Retrieve**

| Tool | Description |
| ---- | ----------- |
| `retrieve_blog` | Retrieve a blog |
| `retrieve_collection` | Retrieve a collection |
| `retrieve_collection_entry` | Retrieve a collection entry |
| `retrieve_form` | Retrieve a form |
| `retrieve_link` | Retrieve a collection link |
| `retrieve_menu` | Retrieve a menu |
| `retrieve_page` | Retrieve a page |
| `retrieve_post` | Retrieve a blog post |
| `retrieve_redirect` | Retrieve a redirect |
| `retrieve_route_pattern` | Retrieve a route pattern |
| `retrieve_submission` | Retrieve a form submission |
| `retrieve_webhook` | Retrieve a webhook |

**Utility**

| Tool | Description |
| ---- | ----------- |
| `search_blutui_documentation` | Search the Blutui documentation |

### Setup

Before MCP tools are available, the user must run `courier mcp init` once. After that, the MCP server starts automatically whenever Courier is running.

```bash
courier mcp init   # one-time setup
```

If MCP tools are unreachable, prompt the user to run `courier mcp init` and ensure Courier is running.

### Handle Validation (Pre-flight Rule)

Before calling any `create_*` tool, always run the corresponding `list_*` tool first and check that the desired handle does not already exist. If a conflict is found, notify the user instead of proceeding.

If the MCP tools are unreachable, ask the user for the specific `handle` before suggesting any configuration.

### Search Documentation First

Use `search_blutui_documentation` before making code changes to confirm the correct approach. Do not fall back to guessing or prior knowledge when the docs can answer the question.

Reference:
- [Link to documentation - Connect to Blutui MCP](https://docs.blutui.com/docs/getting-started/agentic-development)

---


## Courier

Courier is the command-line interface for interacting with a Blutui project. It pushes code to the platform, pulls code down to the local machine, and bundles the Blutui MCP server.

Courier must be installed and configured on the user's machine. Run `courier version` to confirm it is installed.

### Common Commands

| Command | Description |
| ------- | ----------- |
| `courier version` | Print the installed Courier version |
| `courier login` | Authenticate Courier against the user's Blutui account |
| `courier init` | Initialise Courier inside an existing project directory |
| `courier create` | Scaffold a new Blutui project |
| `courier dev` | Start the local development server with file watching |
| `courier push` | Push local `views/` and `public/` changes up to the platform |
| `courier pull` | Pull the latest project code down from the platform |
| `courier open` | Open the project in the Blutui dashboard |
| `courier mcp init` | One-time setup for the Blutui MCP server (the server then starts automatically whenever Courier is running) |

Courier only syncs the `public/` and `views/` directories — files outside those directories are ignored by `push` and `pull`.

Reference: [Link to documentation](https://docs.blutui.com/docs/courier/getting-started)

---


## Cassettes

Cassettes function as a version control system for the front-end logic of a Blutui project. Each project can have multiple cassettes, allowing the developer to manage and toggle between different website designs within a single project.

### Switching Cassettes

Update the `cassette` property in `courier.json` to switch the active cassette. If the property is missing or undefined, prompt the user for the specific cassette handle.

### Active Cassette Safety

**Never develop directly on an active (live) cassette.** The recommended workflow is:

1. Duplicate the active cassette in the dashboard.
2. Switch the local `cassette` value in `courier.json` to the new duplicate.
3. Make changes against the duplicate.
4. Promote it back to active when ready.

When pushing changes to an active cassette directly, Courier will refuse the operation unless the `--allow-active` flag is passed. Do not use `--allow-active` without explicit user confirmation — it bypasses the safety check and can break a live site immediately.

### Canopy Content Across Cassettes

**Important:** Canopy elements with the same `name` (handle) share content across cassettes. Renaming or duplicating a cassette does not duplicate the underlying Canopy content — both cassettes will read and write the same value. To isolate content between cassettes, use a different handle in the new cassette's templates.

Reference: [Link to documentation](https://docs.blutui.com/docs/cassettes/getting-started)

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

---


## Blog

Blutui blogs use automatic routing — **no route patterns or page registrations are needed**. Create the layout files and register the blog via MCP. Blutui handles all routing automatically.

### File Structure

```
views/
  layouts/
    blogs/
      index.html   # Blog listing page
      post.html    # Individual post page
```

If you have multiple blogs with different designs, use separate folders:

```
views/layouts/news/
views/layouts/events/
```

Each blog can have its own `index.html` and `post.html` layouts.

### Blog Index Layout (`index.html`)

On the index page the `blog` object is automatically available. Use `blog.posts` to loop through posts.

```canvas
{% extends 'templates/default.html' %}

{% block body %}
<div>
  <h1>{{ blog.name }}</h1>

  {% for post in blog.posts | sort((a, b) => b.publish_date <=> a.publish_date) %}
    <div>
      <img src="{{ post.cover_image | image_url({ width: 800, format: 'webp' }) }}" alt="{{ post.title }}">
      <h2>{{ post.title }}</h2>
      <p>{{ post.description }}</p>
      <p>{{ post.publish_date | date('d M Y') }}</p>
      <p>{{ post.author }}</p>
      <p>{{ post.content | reading_time }} reading time</p>
      <a href="{{ post.slug }}">Read more</a>
    </div>
  {% endfor %}
</div>
{% endblock %}
```

**`blog` object fields:**

| Field              | Description        |
| ------------------ | ------------------ |
| `blog.name`        | Blog name          |
| `blog.slug`        | Blog slug          |
| `blog.uri`         | Blog URI path      |
| `blog.description` | Blog description   |
| `blog.posts`       | Array of all posts |

### Post Layout (`post.html`)

On the post page the `post` object is automatically available.

```canvas
{% extends 'templates/default.html' %}

{% block body %}
<div>
  <h1>{{ post.title }}</h1>
  <h3>{{ post.description }}</h3>
  <p>{{ post.publish_date | date('d M Y') }}</p>
  <p>{{ post.author }}</p>
  <p>{{ post.content | reading_time }} reading time</p>
  <img src="{{ post.cover_image | image_url({ width: 1200, format: 'webp' }) }}" alt="{{ post.title }}">
  <div>{{ post.content | raw }}</div>
</div>
{% endblock %}
```

**`post` object fields:**

| Field               | Description                           |
| ------------------- | ------------------------------------- | ------- |
| `post.title`        | Post title                            |
| `post.description`  | Short description                     |
| `post.content`      | Rich text body — render with `        | raw`    |
| `post.cover_image`  | Cover image URL                       |
| `post.publish_date` | Publication date — format with `      | date()` |
| `post.author`       | Author name                           |
| `post.slug`         | Post URL — use directly in `<a href>` |

### MCP Workflow

1. Create `views/layouts/blogs/index.html` and `views/layouts/blogs/post.html`.
2. Run `list_blogs` to check for an existing blog with the same handle.
3. Use `create_blog` — set the **index layout** to `layouts/blogs/index.html` and **post layout** to `layouts/blogs/post.html`.
4. Run `list_posts` → use `create_post` to add posts to the blog.

Do **not** call `create_page` or `create_route_pattern` — routing is handled automatically by Blutui.

Reference: [Link to documentation](https://docs.blutui.com/guides/create-blog)

---


## Blutui Form standards and examples

### Directory Structure

Ensure your `views` directory is organized as follows:

- `views/`
  - `components/`
    - `form.html` (Macro definitions)
  - `forms/`
    - `contact.html` (Form implementation)

#### Usage Example (in `views/components/form.html`):

```canvas
{% macro input(data) %}
  <input type="{{ data.type }}" name="{{ data.name }}" placeholder="{{ data.placeholder }}" {% if data.required %} required {% endif %} />
{% endmacro %}

{% macro textarea(data) %}
  <textarea name="{{ data.name }}" placeholder="{{ data.placeholder }}" {% if data.required %} required {% endif %}></textarea>
{% endmacro %}

{% macro select(data) %}
  <select name="{{ data.name }}" {% if data.required %} required {% endif %}>
    {% for option in data.options %}
      <option value="{{ option.value }}">{{ option.label }}</option>
    {% endfor %}
  </select>
{% endmacro %}

{% macro errors(data) %}
  {% if data.errors %}
    <ul class="field-errors">
      {% for error in data.errors %}
        <li>{{ error }}</li>
      {% endfor %}
    </ul>
  {% endif %}
{% endmacro %}

{% macro field(data) %}
  <div class="field-wrapper">
    <label>{{ data.label }}</label>
    {% if data.type == 'textarea' %}
      {{ _self.textarea(data) }}
    {% elseif data.type == 'select' %}
      {{ _self.select(data) }}
    {% else %}
      {{ _self.input(data) }}
    {% endif %}
    {{ _self.errors(data) }}
  </div>
{% endmacro %}
```

#### Usage Example (in `views/forms/contact.html`):

```canvas
{% import 'components/form' as ui %}

{% form 'contact' %}
  {% for field in form.fields %}
    {{ ui.field(field) }}
  {% endfor %}

  <button type="submit" class="">Submit</button>
{% endform %}
```

### Form Field Constraints

**Allowed field types:**

| Type | Description |
| ---- | ----------- |
| `text` | Single line of text |
| `textarea` | Multi-line plain text |
| `email` | Email address with validation |
| `phone` | Phone number |
| `url` | Web address or link |
| `number` | Numeric value |
| `select` | Dropdown — pick one option |
| `radio` | Choose one option from a visible list |
| `checkbox` | Select multiple options from a list |
| `date` | Calendar date picker |
| `time` | Time of day picker |
| `hidden` | Hidden field not visible to the user |

- Do not use custom field types. If a required type is not in this list, default to `text` and notify the user.
- Always transmit field types to the MCP in lowercase format.

### MCP Workflow

Run `list_forms` first to confirm no form with the same handle exists, then use `create_form` to register the form. Use `list_submissions` or `retrieve_submission` to access submitted data.

Reference: [Link to documentation](https://docs.blutui.com/guides/create-form)

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

---


## Routing Pattern Standard

The agent must pay attention to route patterns when the project would require to build many pages that will include more than one nested page.

- A route pattern could include parameter(s) (e.g., `/team/:name`), which is accessed in code via `route.data.name`.
- The supported parameter types: string, slug, date, time, number.
- Each unique route pattern is mapped to a single template file.
- **Do not create route patterns for blogs.** Blutui blogs auto-route — see `rules/blog.md`. Use route patterns only for collection-driven detail pages (e.g. `/team/:name`, `/products/:slug`).

Route patterns can be utilised to filter collections as shown below:

```canvas
{% set members = cms.collection('team') %}
{% set member = members | filter(entry => (entry.name | slug) == route.data.name) | first %}
<h1>{{ member.name }}</h1>
<p>{{ member.bio }}</p>
```

Use Blutui MCP tools to create, retrieve and list route patterns.

Run `list_route_patterns` first and confirm the pattern is unique before calling `create_route_pattern`.

Reference: [Link to documentation - How do I use route patterns in my project?](https://docs.blutui.com/guides/add-route-patterns)

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

</blutui-project-guidelines>
