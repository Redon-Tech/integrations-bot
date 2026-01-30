const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');

/**
 * Discord slash command for checking bot and API latency.
 * @type {import('discord.js').SlashCommandBuilder}
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with bot latency and API ping'),
    
    /**
     * Executes the ping command, replying with latency information.
     * @param {import('discord.js').ChatInputCommandInteraction} interaction - The command interaction.
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Testing Ping, please wait.', flags: MessageFlags.Ephemeral });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        const pingEmbed = new EmbedBuilder()
            .setTitle('Ping Results')
            .addFields(
                { name: 'Bot Latency', value: `${latency}ms` },
                { name: 'API Latency', value: `${apiLatency}ms` }
            )
            .setColor(0x00AE86);

        await interaction.editReply({ embeds: [pingEmbed] });
    },
};
