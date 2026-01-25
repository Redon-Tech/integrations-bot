# Payhip Sales Integration Bot

A lightweight Discord bot that integrates Payhip with Discord to deliver real-time sales notifications. Receive beautifully formatted embeds with product details, coupon tracking, and multi-item purchase support directly in your Discord channels. Built with Node.js and discord.js, this bot makes tracking your Payhip sales effortless.

## Roadmap

### Completed
- Basic webhook receiver (Express server)
- Discord bot foundation with event handling
- Sales notification embeds with product details
- Coupon/discount tracking
- Sale item indicators
- Logging system with daily log files
- Environment-based configuration
- Refund notifications
- Subscription notifications
- Coupon discount calculations
- Payment type tracking
- Multi-product display support
- Customizable embed colors per event type
- **SQL-based database with external schema and query files**
- **Config command with live reload (no restart required)**
- **Hex color codes for embed configuration**
- **CamelCase naming convention throughout codebase**
- **Admin tools for config and stats**

### In Development
- **Simple Integration** - Single API, single tenant (server/payhip)
- Sales event handling with rich embeds

# Discord Commands
- `/sales` - View recent sales
- `/stats` - View basic sales statistics
- `/config` - Configure bot settings (admin only, live reload)
- `/configoptions` - View available config keys for a section
- `/test` - Send test webhook notification
- `/help` - Display available commands
- `/botinfo` - Displays information about the bot

### Planned Features

#### Multi-Tenant Support (Version 2 Addition)
- Support multiple Payhip accounts per bot instance
- Per-tenant webhook endpoints
- Per-tenant Discord channel routing
- Tenant-specific configuration management

#### Web Dashboard (Version 2 Addition)
- Real-time sales monitoring
- Analytics and reporting
- Configuration management UI
- Webhook endpoint management
- Bot status and health monitoring

## Current Features

- **Real-time Notifications**: Instant Discord notifications for Payhip sales
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
- **CamelCase Naming**: Consistent camelCase for all local variables and config keys
- **Logging**: Comprehensive logging with timestamps and error tracking
- **Admin Tools**: Slash commands for config, stats, and options
