const botLogger = require('../modules/botLogger');

/**
 * Discord event handler for 'warn' events.
 * Logs warnings from the Discord client.
 * @type {{ name: string, execute: function(string): Promise<void> }}
 */
module.exports = {
    name: 'warn',

    /**
     * Handles a warning event from the Discord client.
     * @param {string} warning - The warning message.
     * @returns {Promise<void>}
     */
    async execute(warning) {
        botLogger.log('Warning received from Discord:', 'WARN', { warning });
    },
};