const botLogger = require('../modules/botLogger');

/**
 * Discord event handler for 'ready' event (clientReady).
 * Logs when the bot is ready and operational.
 * @type {{ name: string, once: boolean, execute: function(import('discord.js').Client): Promise<void> }}
 */
module.exports = {
    name: 'clientReady',
    once: true,

    /**
     * Handles the client ready event.
     * @param {import('discord.js').Client} client - The Discord client instance.
     * @returns {Promise<void>}
     */
    async execute(client) {
        botLogger.log(`Logged in as ${client.user.tag}!`, 'READY');
        botLogger.log('Bot is ready and operational.', 'READY');
        botLogger.log(`Bot Statistics: Users: ${client.users.cache.size}, Guilds: ${client.guilds.cache.size}, Channels: ${client.channels.cache.size}`, 'STATS');
    }
}