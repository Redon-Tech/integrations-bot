---
title: Webhook Integration Overview
authors:
  - MiataVxbe
---
# Installation Guide

This guide covers two main installation scenarios:

- **Self-Hosted (Home Server/PC/Raspberry Pi):** Run the bot on your own hardware at home or in your office.
- **Paid VPS (Cloud Host):** Use a paid virtual private server (VPS) provider for 24/7 uptime and public accessibility.

Both methods are supported! Follow the steps below for your preferred setup.

---

## Self-Hosted vs Paid VPS: Quick Comparison

| Feature                | Self-Hosted                | Paid VPS (Cloud Host)         |
|------------------------|----------------------------|-------------------------------|
| Cost                   | Free (uses your hardware)  | Monthly fee (varies)          |
| Uptime                 | Depends on your device     | 24/7, high reliability        |
| Public Accessibility   | Requires port forwarding   | Public IP by default          |
| Maintenance            | You manage everything      | Host manages hardware         |
| Best For               | Hobbyists, testing         | Production, always-on bots    |

---

## 1. Download the Bot Code

Welcome to the installation guide for the Payhip Sales Integration Bot! This step-by-step guide will help you set up the bot from scratch, including downloading the code, installing dependencies, and preparing your environment for production use.

---

## 1. Download the Bot Code

Download the latest version of the bot from the official repository:

> [PLACEHOLDER_FOR_DOWNLOAD_LINK]

---

## 2. Choose Your Hosting Method

### Option A: Self-Hosted (Home Server/PC/Raspberry Pi)

1. **Prepare your device:**
  - Use Windows, Linux, or macOS. Raspberry Pi (with Node.js) is also supported.
2. **Ensure your device stays online** for as long as you want the bot to run.
3. **Set up port forwarding** on your router:
  - Forward the port you set in `webhookConfig.webhookPort` (default: 3010) to your device’s local IP address.
  - This allows Payhip to reach your webhook endpoint from the internet.
4. **(Recommended) Use a dynamic DNS service** if your home IP changes frequently (e.g., DuckDNS, No-IP).
5. **Continue with the steps below to extract, install, and configure the bot.**

---

### Option B: Paid VPS (Cloud Host)

1. **Choose a VPS provider:**
  - Examples: DigitalOcean, Vultr, Linode, Hetzner, AWS Lightsail, etc.
2. **Deploy a server:**
  - Recommended: Ubuntu 22.04 LTS or similar.
  - Choose a region close to your users.
3. **Connect via SSH:**
  - Use an SSH client (e.g., PuTTY, Terminal) to access your VPS.
4. **Update your system:**
  - Run `sudo apt update && sudo apt upgrade -y` (Linux) to ensure your server is up to date.
5. **Install Node.js:**
  - Use NodeSource or your package manager to install Node.js v18+.
6. **Continue with the steps below to extract, install, and configure the bot.**

---

> ![Download Page Screenshot](../assets/img/download_page_screenshot)

---

## 2. Extract and Open the Project
_(If you used a VPS, upload or clone the project to your server before this step.)_

Unzip the downloaded archive (if applicable) and open the project folder in your code editor (e.g., VS Code).
---

## 3. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) (v18 or newer) installed. Then, open a terminal in the project directory and run:

```
npm install
```

This will install all required packages listed in `package.json`.

---

## 4. Configure Your Bot

Follow the [Configuration Guide](configuration.md) to set up your `config.json` file with your Discord and Payhip details.

> ![Config File Screenshot](../assets/img/config_file_example.png)

---

## 5. Setting Up a Domain (Recommended)
_(Both self-hosted and VPS users benefit from a domain for webhooks. See below for networking tips.)_

To receive Payhip webhooks, your bot must be accessible from the internet. This requires a public domain name.

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

## 6. Running the Bot
_(Run these commands on your self-hosted device or VPS, depending on your setup.)_

Start the bot with:

```
node src/bot/Handler.js
```
_Only use PM2 if using a home machine / server that won't autostart whatever process it's running on startup_
Or use a process manager like [PM2](https://pm2.keymetrics.io/) for production:

```
npm install -g pm2
pm2 start src/bot/Handler.js --name payhip-bot
```

> ![Bot Running Screenshot](../assets/img/bot_running_example.png)

---

## 7. Setting Up Payhip Webhooks
_(Your webhook URL must be public. For self-hosted, this means your home IP/domain and port must be reachable from the internet. For VPS, use your server’s public IP/domain.)_

1. Go to Payhip Dashboard > Account > Settings > Developer.
2. Enter your public webhook URL (e.g., `https://yourdomain.com/webhook/payhip`).
3. Select the events you want to receive.

> ![Payhip Webhook Setup Screenshot](../assets/img/payip_settings_example.png)

---

## Troubleshooting

- **Bot won’t start?** Check your Node.js version and ensure all dependencies are installed.
- **Webhooks not received?** Make sure your domain is set up correctly and your server is accessible from the internet.
- **Discord errors?** Double-check your bot token and channel IDs in the config.

---

> **Need help?** Join our [Discord support server](https://discord.gg/Eb384Xw).