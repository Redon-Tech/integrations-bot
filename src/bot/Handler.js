require('dotenv').config({ path: './src/config/.env' })
const serverInit = require('./modules/serverInit')
const botLogger = require('./modules/botLogger')
const { initializeBot } = require('./modules/botloader')

// Initialize bot asynchronously to register commands before login
(async () => {
    const { client } = await initializeBot();

    client.login(process.env.BOT_TOKEN)
        .then(() => {
            botLogger.logEvent('Login successful, starting server.', 'Login');
            serverInit(client);
        })
        .catch(error => {
            botLogger.logError('Failed to login to Discord', error);
            process.exit(1);
        });

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
})();
