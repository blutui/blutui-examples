---
title: MCP
impact: HIGH
impactDescription: Efficiency Multiplier - The Blutui MCP grants agents direct access to project-specific tooling, streamlining complex workflows and increasing development velocity.
tags: mcp, tools, search, documentation
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
