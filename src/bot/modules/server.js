const express = require('express');
const createEmbed = require('./embedCreator')
const formatTime = require('./formatUptime')
const { salesChannelId, refundsChannelId, subscriptionsChannelId, webhookPort, webhookPath } = require('../../config/config.json');
const botLogger = require("./botLogger")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let client = null;

const stateTime = Date.now();

/**
 * Initilize the server & bot client.
 * @param {Client} botClient - Discord Bot Client
 */

function initServer(botClient) {
    client = botClient;

    // Verifiy the webhook endpoint
    app.get(webhookPath, (req, res) => {
        res.status(200).send('Webhook endpoint is live.');
    });

    // Main Payhip webhook endpoint
    app.post(webhookPath, async (req, res) => {
        try {
            const data = req.body;
            const eventType = data.type || data.event;

            botLogger.logEvent(`Received webhook event: ${eventType}`);

            res.status(200).send('OK')

            const channel = await client.channels.fetch(salesChannelId);
            if (!channel) {
                botLogger.logError(`Channel with ID ${salesChannelId} not found.`);
                return;
            }

            const embed = createEmbed(eventType, data);

            await channel.send({ embeds: [embed] });
            botLogger.logEvent(`Processed webhook event: ${eventType}`);
        } catch (error) {
            botLogger.logError('Error processing webhook event', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.listen(webhookPort, () => {
        botLogger.logEvent(`Server is listening on port ${webhookPort}`, 'Server');
        botLogger.logEvent(`Webhook URL: ${webhookURL}:${webhookPort}${webhookPath}`, 'Server');
    });
}

module.exports = initServer;