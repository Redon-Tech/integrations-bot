const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config.json').discordConfig;
const botLogger = require('./botLogger');
const { loadCommands } = require('./commandLoader');

/**
 * Initializes and returns a Discord bot client, loads commands and events.
 *
 * @returns {Promise<{client: import('discord.js').Client, startTime: number}>} Client instance and start time.
 */
async function initializeBot() {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ],
        presence: {
            activities: [{ name: config.botActivity || 'with code', type: 0 }],
            status: 'online',
        },
    });

    // Load slash commands (await to ensure they're registered before bot is ready)
    await loadCommands(client);

    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
        botLogger.log(`Loaded event: ${event.name}`);
    }
    const startTime = Date.now();
    return { client, startTime };
}

module.exports = { initializeBot };