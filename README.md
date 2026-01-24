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

### In Development
- **Simple Integration** - Single API, single tenant (server/payhip)
- Sales event handling with rich embeds

### Planned Features

#### Multi-Tenant Support
- Support multiple Payhip accounts per bot instance
- Per-tenant webhook endpoints
- Per-tenant Discord channel routing
- Tenant-specific configuration management

#### Web Dashboard
- Real-time sales monitoring
- Analytics and reporting
- Configuration management UI
- Webhook endpoint management
- Bot status and health monitoring

#### Discord Commands
- `/sales` - View recent sales
- `/stats` - View basic sales statistics
- `/config` - Configure bot settings (admin only)
- `/test` - Send test webhook notification
- `/help` - Display available commands

#### Notification Enhancements
- Customer email privacy options
- Customizable embed colors per event type

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
- **Configurable**: JSON-based configuration for channels, colors, and webhook settings
- **Logging**: Comprehensive logging with timestamps and error tracking
