const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') })
const serverInit = require('./modules/serverInit')
const botLogger = require('./modules/botLogger')
const { initializeBot } = require('./modules/botLoader')

/**
 * Entry point for the Integrations Bot.
 * Loads environment variables, initializes the Discord bot, and starts the webhook server.
 * Handles graceful shutdown on SIGINT/SIGTERM.
 */

// Verify environment variables loaded
if (!process.env.BOT_TOKEN) {
    console.error('BOT_TOKEN not found in environment variables');
    process.exit(1);
}

/**
 * Main startup function for the bot.
 * Initializes the Discord client, logs in, and starts the webhook server.
 * Handles graceful shutdown signals.
 * @returns {Promise<void>}
 */
async function startBot() {
    try {
        const { client } = await initializeBot();

        await client.login(process.env.BOT_TOKEN);
        botLogger.logEvent('Login successful, starting server.', 'Login');
        serverInit(client);

        // Handle graceful shutdown on SIGINT
        process.on("SIGINT", async () => {
            botLogger.logEvent("Shutting down gracefully.", "Shutdown");
            await client.destroy()
            process.exit(0)
        })

        // Handle graceful shutdown on SIGTERM
        process.on("SIGTERM", async () => {
            botLogger.logEvent("Shutting down gracefully.", "Shutdown");
            await client.destroy()
            process.exit(0)
        })
    } catch (error) {
        botLogger.logError('Failed to login to Discord', error);
        process.exit(1);
    }
}

// Start the bot
startBot();