const botLogger = require('../modules/botLogger');

module.exports = {
    name: 'clientReady',
    once: true,

    async execute(client) {
        botLogger.log(`Logged in as ${client.user.tag}!`, 'READY');
        botLogger.log('Bot is ready and operational.', 'READY');
        botLogger.log(`Bot Statistics: Users: ${client.users.cache.size}, Guilds: ${client.guilds.cache.size}, Channels: ${client.channels.cache.size}`, 'STATS');
    }
}