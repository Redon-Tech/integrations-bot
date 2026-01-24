const botLogger = require('../modules/botLogger')

module.exports = {
    name: 'error',
    async execute(error) {
        botLogger.logError('An error occurred:', error);
    },
}