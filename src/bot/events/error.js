const botLogger = require('../modules/botLogger')

module.exports = {
    name: 'error',
    async execute(error) {
        console.error('Discord Client Error:', error);
        botLogger.logError('An error occurred:', error);
    },
}