const express = require('express');
const createEmbed = require('./embedCreator')
const formatTime = require('./formatUptime')
const config = require('../../config/config.json');
const botLogger = require("./botLogger")
const salesTracker = require('./salesTracker')

const { salesChannelId, refundsChannelId, subscriptionsChannelId } = config.discordConfig;
const { webhookPort, webhookPath, webhookURL } = config.webhookConfig;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let client = null;

const startTime = Date.now();

/**
 * Initilize the server & bot client.
 * @param {Client} botClient - Discord Bot Client
 */

function serverInit(botClient) {
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

            let channelId;
            switch (eventType) {
                case "paid":
                    channelId = salesChannelId;
                    break;
                case "subscription.created":
                    channelId = subscriptionsChannelId;
                    break;
                case "subscription.deleted":
                    channelId = subscriptionsChannelId;
                    break;
                case "refunded":
                    channelId = refundsChannelId;
                    break;
            }

            // Prevent test payloads from being tracked in the database
            const isTestPayload = typeof data.signature === 'string' && data.signature.startsWith('test');

            if (!isTestPayload) {
                // Track the event in sales tracker first
                switch (eventType) {
                    case "paid":
                        salesTracker.trackSale(data);
                        break;
                    case "refunded":
                        salesTracker.trackRefund(data);
                        break;
                    case "subscription.created":
                        salesTracker.trackSubscription(data, eventType);
                        break;
                    case "subscription.deleted":
                        salesTracker.trackSubscription(data, eventType);
                        break;
                }
            }

            const channel = await client.channels.fetch(channelId);
            if (!channel) {
                botLogger.logError(`Channel with ID ${channelId} not found.`);
                res.status(500).send('Channel not found');
                return;
            }

            const embed = createEmbed(eventType, data);
            await channel.send({ embeds: [embed] });
            botLogger.logEvent(`Processed webhook event: ${eventType}`);
            res.status(200).send('OK');
        } catch (error) {
            botLogger.logError('Error processing webhook event', error);
            if (!res.headersSent) {
                res.status(500).send('Internal Server Error');
            }
        }
    });

    app.listen(webhookPort, () => {
        botLogger.logEvent(`Server is listening on port ${webhookPort}`, 'Server');
        botLogger.logEvent(`Webhook URL: ${webhookURL}:${webhookPort}${webhookPath}`, 'Server');
    });
}

module.exports = serverInit;