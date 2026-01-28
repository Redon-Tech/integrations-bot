---
title: Webhook Integration Overview
authors:
  - MiataVxbe
---
# `/config` Command

The `/config` command allows server administrators to update the bot's configuration directly from Discord. This command is essential for changing bot settings without editing files manually or restarting the bot externally.

## Usage

```
/config set section:<section> key:<key> value:<value>
```

### Subcommands
- **set**: Update a specific configuration value.

## Options
- **section** (string, required): The configuration section to update. Autocompletes available sections from the config file.
- **key** (string, required): The key within the section to update.
- **value** (string, required): The new value to set. Accepts strings, numbers, booleans, or JSON objects.

## Permissions
Only users with the **Administrator** permission can use this command. If a non-admin attempts to use it, the bot will deny the request.

## Behavior
- The command reads the current configuration from `config/config.json`.
- It checks if the specified section and key exist. If not, it replies with an error.
- The value is parsed as JSON if possible (so you can set numbers, booleans, or objects, not just strings).
- The configuration file is updated on disk.
- If you update `discordConfig.botActivity`, the bot's presence/activity is updated live.
- Replies with a confirmation message on success.

## Example

```
/config set section:discordConfig key:botActivity value:"Playing with integrations!"
```

## Notes
- Use with caution: incorrect changes may affect bot behavior.
- Some changes may require a bot restart to take full effect (except for bot activity, which updates instantly).

---
For more details, see the configuration file in `src/config/config.json` or contact the maintainers.
