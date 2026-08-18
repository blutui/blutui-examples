---
title: Cassettes - Project Version Control
impact: LOW
impactDescription: Version Control Impact - High. This configuration is critical only during project version transitions. Incorrect setup will block the ability to switch versions or result in environment mismatches during a migration.
tags: cassette, version control
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
