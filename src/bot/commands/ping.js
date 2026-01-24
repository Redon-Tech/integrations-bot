const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with bot latency and API ping'),
    
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
