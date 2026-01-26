---
title: Config Command
authors:
  - MiataVxbe
hide:
  - navigation
---

# Database Configuration

The bot uses a SQL-based database to store sales, refunds, and subscription data. Most users will not need to modify the database configuration, but advanced users can adjust some options in the `config.json` file.

## Configuration File

Database-related options are found in the `databaseConfig` section of your `config.json`:

```json
{
  "databaseConfig": {
    "maxSales": 200
  }
}
```

### Options

| Option    | Type    | Default | Description                                      |
|-----------|---------|---------|--------------------------------------------------|
| maxSales  | number  | 200     | Maximum number of sales records to keep in cache |

> **Note:** Increasing `maxSales` may use more storage, but allows for more sales history in commands like `/sales`.

## Editing Queries or Schema

If you wish to modify the database schema or queries, do so with caution. Custom changes to SQL files in `src/data/queries/` or `src/data/schema/` are not supported unless they are required by an official update from Redon Tech.

**We only provide support for issues caused by official updates.**

## Best Practices

- Only edit `databaseConfig` in `config.json` for supported options.
- Back up your database before making any manual changes.
- Use the `/config` and `/configoptions` commands in Discord to view and update configuration live.

For more details on the database schema, see [schema.md](schema.md). For available queries, see [queries.md](queries.md).