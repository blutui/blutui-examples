---
title: Courier
impact: CRITICAL
impactDescription: Without Courier CLI, project updates cannot be pushed to the Blutui platform. It is essential for continuous integration, version synchronization, and maintaining a functional development lifecycle.
tags: courier, command-line interface tool
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
