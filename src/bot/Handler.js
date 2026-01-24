const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') })
const serverInit = require('./modules/serverInit')
const botLogger = require('./modules/botLogger')
const { initializeBot } = require('./modules/botLoader')

// Verify environment variables loaded
if (!process.env.BOT_TOKEN) {
    console.error('BOT_TOKEN not found in environment variables');
    process.exit(1);
}

// Main startup function
async function startBot() {
    try {
        const { client } = await initializeBot();

        await client.login(process.env.BOT_TOKEN);
        botLogger.logEvent('Login successful, starting server.', 'Login');
        serverInit(client);

        process.on("SIGINT", async () => {
            botLogger.logEvent("Shutting down gracefully.", "Shutdown");
            await client.destroy()
            process.exit(0)
        })

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

startBot();