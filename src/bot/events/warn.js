const botLogger = require('../modules/botLogger');

module.exports = {
    name: 'warn',

    async execute(warning) {
        botLogger.log('Warning received from Discord:', 'WARN', { warning });
    },
};