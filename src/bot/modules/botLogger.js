const fs = require('fs');
const path = require('path');

/**
 * Logger class for writing bot events, commands, and errors to log files and console.
 */
class BotLogger {
    /**
     * Constructs a new BotLogger instance.
     * @param {string} logDirectory - Directory to store log files.
     */
    constructor(logDirectory) {
        this.logDirectory = logDirectory;
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }
    }

    /**
     * Logs a message to the log file and console.
     * @param {string} message - The message to log.
     * @param {string} [level='INFO'] - Log level.
     * @param {Object} [data] - Additional data to log.
     */
    log(message, level = 'INFO', data) {
        const timestamp = new Date().toISOString();
        let logMessage = `[${timestamp}] [${level}] ${message}`;
        if (data) {
            logMessage += ` | Data: ${JSON.stringify(data)}`;
        }
        logMessage += '\n';
        const logFilePath = path.join(this.logDirectory, `${new Date().toISOString().slice(0,10)}.log`);
        fs.appendFileSync(logFilePath, logMessage);
        console.log(logMessage.trim());
    }

    /**
     * Formats a console message with timestamp, level, and data.
     * @param {string} message - The message.
     * @param {string} level - Log level.
     * @param {Object} data - Additional data.
     * @param {string} timestamp - ISO timestamp.
     * @returns {string} The formatted message.
     */
    formatConsoleMessage(message, level, data, timestamp) {
        let formattedMessage = `[${timestamp}] [${level}] ${message}`;
        if (data) {
            formattedMessage += ` | Data: ${JSON.stringify(data)}`;
        }
        return formattedMessage;
    }

    /**
     * Logs a command execution event.
     * @param {string} message - The message.
     * @param {string} commandName - Command name.
     * @param {string} userId - User ID.
     * @param {string} [level='COMMAND'] - Log level.
     * @param {Object} [args={}] - Additional arguments.
     */
    logCommand(message, commandName, userId, level = 'COMMAND', args = {}) {
        const data = {
            user: userId,
            guild: args.guildId || 'DM',
            channel: args.channelId || 'DM',
            commandName: commandName,
            arguments: args.arguments || {}
        };
        this.log(message, level, data);
    }

    /**
     * Logs a general event.
     * @param {string} message - The message.
     * @param {string} eventName - Event name.
     * @param {string} [level='EVENT'] - Log level.
     * @param {Object} [data={}] - Additional data.
     */
    logEvent(message, eventName, level = 'EVENT', data = {}) {
        data.event = eventName;
        this.log(message, level, data);
    }

    /**
     * Logs a webhook event.
     * @param {string} message - The message.
     * @param {string} webhookUrl - Webhook URL.
     * @param {string} [level='WEBHOOK'] - Log level.
     * @param {Object} [data={}] - Additional data.
     */
    logWebhook(message, webhookUrl, level = 'WEBHOOK', data = {}) {
        data.webhookUrl = webhookUrl;
        this.log(message, level, data);
    }

    /**
     * Logs an error event.
     * @param {string} message - The message.
     * @param {Error} error - The error object.
     * @param {string} [level='ERROR'] - Log level.
     */
    logError(message, error, level = 'ERROR') {
        const data = {
            errorMessage: error.message,
            stack: error.stack
        };
        this.log(message, level, data);
    }
}

const logDirectory = path.join(__dirname, '../logs');
module.exports = new BotLogger(logDirectory);