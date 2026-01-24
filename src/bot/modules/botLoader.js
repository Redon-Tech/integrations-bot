const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config/config.json').discordConfig;
const botLogger = require('./botLogger');

/** 
 * initializes and returns a Discord bot client
 * @returns {Object} Client instance and start time
 */

function initializeBot() {
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