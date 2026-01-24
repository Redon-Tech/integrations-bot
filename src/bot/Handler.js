require('dotenv').config({ path: './src/config/.env' })
const { initServer } = require('./modules/serverInit')
const { botLogger } = require('./modules/botLogger')
const { initializeBot } = require('./modules/botloader')

const { client } = initializeBot()

client.login(process.env.DISCORD_BOT_TOKEN)
    .then(() => {
        botLogger.logEvent('Login successful, starting server.', 'Login');
        initServer(client);
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
