---
title: Blog
impact: HIGH
impactDescription: Content Rendering - Blogs use automatic routing and dedicated template variables. Using incorrect template variables or adding unnecessary route patterns will break the blog system.
tags: blog, posts, publish_date, blog listing, blog post
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
