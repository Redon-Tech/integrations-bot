
---
title: Project Architecture
authors:
	- MiataVxbe
hide:
	- navigation
---

# Architecture Overview

This document provides a high-level overview of the Integrations Bot architecture, including its main components and data flow.

## Main Components

- **Discord Bot Core**: Handles command registration, event listening, and interaction with the Discord API.
- **Commands**: Modular command files in `src/bot/commands/` (e.g., `config.js`, `sales.js`, `stats.js`, `test.js`). Each command is a self-contained module.
- **Events**: Event handlers in `src/bot/events/` for Discord events like `clientReady`, `interactionCreate`, `error`, and `warn`.
- **Modules**: Utility and logic modules in `src/bot/modules/` (e.g., `salesTracker.js`, `botLogger.js`, `embedCreator.js`).
- **Configuration**: JSON config files in `src/config/` for bot settings and secrets.
- **Database**: SQLite database accessed via SQL scripts in `src/data/queries/` and `src/data/schema/` for sales, stats, and subscriptions.
- **Docs**: Markdown documentation in `docs/` for commands, setup, and development.

## Data Flow

1. **User Interaction**: Users interact with the bot via Discord slash commands.
2. **Command Handling**: The bot parses the command and routes it to the appropriate handler in `src/bot/commands/`.
3. **Business Logic**: Command handlers use modules (e.g., `salesTracker`) to process data, interact with the database, and generate responses.
4. **Database Access**: SQL queries are executed for reading/writing sales, stats, and config data.
5. **Response**: The bot sends embeds or messages back to Discord based on the command result.

## Extensibility

- New commands can be added by creating a new file in `src/bot/commands/` and registering it.
- Utility modules can be reused across commands.
- Database schema can be extended with new SQL scripts.

---
For more details, see the code in `src/` and the rest of the documentation.
