---
title: Courier Configuration
impact: CRITICAL
impactDescription: Core dependency for Courier operations, MCP connectivity, and Cassette management.
tags: config, handle, cassette, courier.json, login, mcp
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
