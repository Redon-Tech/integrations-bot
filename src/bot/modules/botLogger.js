const fs = require('fs');
const path = require('path');

class BotLogger {
    constructor(logDirectory) {
        this.logDirectory = logDirectory;
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory, { recursive: true });
        }
    }

    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] ${message}\n`;
        const logFilePath = path.join(this.logDirectory, `${new Date().toISOString().slice(0,10)}.log`);
        fs.appendFileSync(logFilePath, logMessage);
        console.log(logMessage.trim());
    }

    formatConsoleMessage(message, level, data, timestamp) {
        let formattedMessage = `[${timestamp}] [${level}] ${message}`;
        if (data) {
            formattedMessage += ` | Data: ${JSON.stringify(data)}`;
        }
        return formattedMessage;
    }

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

    logEvent(message, eventName, level = 'EVENT', data = {}) {
        data.event = eventName;
        this.log(message, level, data);
    }

    logWebhook(message, webhookUrl, level = 'WEBHOOK', data = {}) {
        data.webhookUrl = webhookUrl;
        this.log(message, level, data);
    }

    logError(message, error, level = 'ERROR') {
        const data = {
            errorMessage: error.message,
            stack: error.stack
        };
        this.log(message, level, data);
    }
}

module.exports = new BotLogger();