
# Payhip Sales Integration Bot

A lightweight Discord bot that integrates Payhip with Discord to deliver real-time sales, refund, and subscription notifications. Receive beautifully formatted embeds with product details, coupon tracking, and multi-item purchase support directly in your Discord channels. Built with Node.js and discord.js, this bot makes tracking your Payhip sales effortless.

---

## Quick Start

1. **Clone the repository:**
  ```sh
  git clone https://github.com/Redon-Tech/integrations-bot.git
  cd integrations-bot
  ```
2. **Install dependencies:**
  ```sh
  npm install
  ```
3. **Copy and edit config files:**
  ```sh
  cp src/config/template.config.json src/config/config.json
  cp src/config/.env.template src/config/.env
  ```
  - Edit `src/config/config.json` for channel IDs, webhook config, and other settings.
  - Edit `src/config/.env` for your Discord bot token and client ID.
4. **Run the bot:**
  ```sh
  node src/bot/Handler.js
  ```
  Or use PM2 for production.
5. **Invite the bot to your server:**
  - Use the OAuth2 URL from the Discord Developer Portal with `bot` and `applications.commands` scopes.

For full details, see the [Installation & First Run Guide](docs/get-started/installation.md).

---


## Features

- **Real-time Notifications**: Instant Discord notifications for Payhip sales, refunds, and subscriptions
- **Rich Embeds**: Beautifully formatted sale information including:
  - Product names (with sale indicators)
  - Total price and currency
  - Payment method
  - Coupon usage and savings
  - Transaction IDs
  - VAT status
- **Multi-Product Support**: Handles single and multi-item purchases
- **Configurable**: JSON-based configuration for channels, hex colors, and webhook settings
- **Live Config Reload**: Change config from Discord without restarting the bot
- **SQL Database**: All sales, refunds, and subscriptions tracked in SQLite with external SQL files
- **Logging**: Comprehensive logging with timestamps and error tracking
- **Admin Tools**: Slash commands for config, stats, and options

---

## Commands

- `/sales` — View recent sales
- `/stats` — View sales statistics
- `/config` — Configure bot settings (admin only, live reload)
- `/configoptions` — View available config keys for a section
- `/test` — Send test webhook notification
- `/help` — Display available commands
- `/botinfo` — Displays information about the bot

---

## Documentation

- [Installation & First Run Guide](http://integrations.redon.tech/get-started/installation/)
- [Command Reference](http://integrations.redon.tech/commands/sales/)
- [Webhook Integration](http://integrations.redon.tech/webhooks/integration/)
- [Developer Docs](http://integrations.redon.tech/dev/contributing/)
- [Credits](http://integrations.redon.tech/credits/)

---

## Planned Features

- **Multi-Tenant Support** (future):
  - Multiple Payhip accounts per bot instance
  - Per-tenant webhook endpoints and Discord channel routing
  - Tenant-specific configuration management
- **Web Dashboard** (future):
  - Real-time sales monitoring
  - Analytics and reporting
  - Configuration management UI
  - Webhook endpoint management
  - Bot status and health monitoring

---

## Roadmap

- [x] Basic webhook receiver (Express server)
- [x] Discord bot foundation with event handling
- [x] Sales/refund/subscription notification embeds
- [x] Coupon/discount tracking
- [x] Logging system with daily log files
- [x] Environment-based configuration
- [x] SQL-based database with external schema and query files
- [x] Config command with live reload (no restart required)
- [x] Admin tools for config and stats
- [ ] Multi-tenant support
- [ ] Web dashboard

---
