---
title: Webhook Integration Overview
authors:
  - MiataVxbe
---
# Installation & First Run Guide

Welcome! This guide will walk you through installing, configuring, and running the Integrations Bot for the first time.

---

## 1. Prerequisites

- **Node.js** (v18 or newer) installed
- **npm** (comes with Node.js)
- (Optional) SQLite for database inspection

---

## 2. Download & Extract the Bot

Clone the repository or download the latest release:

```sh
git clone https://github.com/yourusername/integrations-bot.git
cd integrations-bot
```
Or unzip the archive and open the folder in your code editor.

---

## 3. Choose Your Hosting Method

You can run the bot on your own hardware (self-hosted) or a paid VPS/cloud server. See below for tips:

| Feature                | Self-Hosted                | Paid VPS (Cloud Host)         |
|------------------------|----------------------------|-------------------------------|
| Cost                   | Free (uses your hardware)  | Monthly fee (varies)          |
| Uptime                 | Depends on your device     | 24/7, high reliability        |
| Public Accessibility   | Requires port forwarding   | Public IP by default          |
| Maintenance            | You manage everything      | Host manages hardware         |
| Best For               | Hobbyists, testing         | Production, always-on bots    |

---

## 4. Install Dependencies

```sh
npm install
```

---

## 5. Configuration

1. Copy the template config and env files:
   ```sh
   cp src/config/template.config.json src/config/config.json
   cp src/config/.env.template src/config/.env
   ```
2. Open `src/config/config.json` and fill in:
   - **Channel IDs** for sales, refunds, subscriptions (under `discordConfig`)
   - **Webhook config** (under `webhookConfig`)
   - Any other required fields (see comments in the template)
3. Save the file.
4. Open `src/config/.env` and fill in:
   - **BOT_TOKEN** (from Discord Developer Portal)
   - **CLIENT_ID** (from Discord Developer Portal)
5. Save the file.

---

## 6. Domain Setup (Recommended)

To receive Payhip webhooks reliably, your bot must be accessible from the internet. This usually means setting up a public domain name and DNS.

**Free Domain:**
- Use [DigitalPlat](https://digitalplat.org/) to register a free domain.

**DNS Hosting:**
- Use [Cloudflare](https://cloudflare.com/) to manage your DNS for free, add SSL, and protect your site.

**Steps:**
1. Register a free domain at DigitalPlat.
2. Add your domain to Cloudflare and update your nameservers as instructed.
3. Create an A record pointing to your server’s public IP address.
4. (Optional) Enable SSL in Cloudflare for secure HTTPS access.

---

## 7. Database Setup

- The bot will create the SQLite database and tables automatically on first run.
- No manual setup is required unless you want to inspect or modify the schema (see `src/data/schema/`).

---

## 8. Running the Bot

```sh
node src/bot/Handler.js
```
or, if you have a start script:
```sh
npm start
```
Or use a process manager like [PM2](https://pm2.keymetrics.io/) for production:
```sh
npm install -g pm2
pm2 start src/bot/Handler.js --name payhip-bot
```

You should see a message indicating the bot is online.

---

## 9. Inviting the Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and select your application.
2. Under "OAuth2 > URL Generator", select `bot` and `applications.commands` scopes.
3. Set permissions (at minimum: `Send Messages`, `Embed Links`, `Manage Webhooks`).
4. Copy the generated URL and open it in your browser to invite the bot to your server.

---

## 10. Setting Up Payhip Webhooks

1. Go to Payhip Dashboard > Account > Settings > Developer.
2. Enter your public webhook URL (e.g., `https://yourdomain.com/webhook/payhip`).
3. Select the events you want to receive.

---

## 11. Testing the Setup

- Use `/ping` or `/test` in your Discord server to verify the bot is responding.
- Check the console for any errors or status messages.

---

## 12. Troubleshooting

- **Bot not appearing online?**
  - Double-check your bot token in `.env` and config file.
  - Make sure you have internet access and the correct Node.js version.
- **Commands not working?**
  - Ensure the bot has the right permissions in your server.
  - Try re-inviting the bot with the correct scopes.
- **Webhooks not received?**
  - Make sure your domain is set up correctly and your server is accessible from the internet.
  - Check firewall or port issues if self-hosting.
- **Discord errors?**
  - Double-check your bot token and channel IDs in the config.
- For more help, see the documentation or open an issue on GitHub.

---

> **Need help?** Join our [Discord support server](https://discord.gg/Eb384Xw).