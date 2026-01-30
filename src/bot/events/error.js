const botLogger = require('../modules/botLogger')

/**
 * Discord event handler for 'error' events.
 * Logs errors from the Discord client.
 * @type {{ name: string, execute: function(Error): Promise<void> }}
 */
module.exports = {
    name: 'error',

    /**
     * Handles an error event from the Discord client.
     * @param {Error} error - The error object.
     * @returns {Promise<void>}
     */
    async execute(error) {
        console.error('Discord Client Error:', error);
        botLogger.logError('An error occurred:', error);
    },
}