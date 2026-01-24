const botLogger = require('../modules/botLogger');

module.exports = {
    name: 'ready',
    once: true,

    async execute(client) {
        botLogger.logInfo(`Logged in as ${client.user.tag}!`);
        botLogger.log('Bot is ready and operational.', 'READY');
        botLogger.log(`Bot Statistics: Users: ${client.users.cache.size}, Guilds: ${client.guilds.cache.size}, Channels: ${client.channels.cache.size}`, 'STATS');
    }
}