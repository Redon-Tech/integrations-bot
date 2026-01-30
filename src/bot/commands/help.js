const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');

/**
 * Discord slash command for displaying help information.
 * @type {import('discord.js').SlashCommandBuilder}
 */
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Generic help command'),
    
    /**
     * Executes the help command, replying with a list of available commands.
     * @param {import('discord.js').ChatInputCommandInteraction} interaction - The command interaction.
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        const helpEmbed = new EmbedBuilder()
            .setTitle('Command Overview')
            .setDescription('Here is a list of available commands:')
            .addFields(
                { name: '/ping', value: 'Check the bot\'s latency and API ping.' },
                { name: '/help', value: 'Display this help message.' },
                { name: '/botstatus', value: 'Get the current status of the bot.' },
                { name: '/config', value: 'Setup and configure the bot for your server.' },
                { name: '/sales', value: 'Display the last 10 sales from your Payhip account.' },
                { name: '/stats', value: 'Show detailed sales statistics.' }
            )
            .setColor(0x00AE86)
            .setFooter({ text: 'Integrations Bot Help', iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [helpEmbed], flags: MessageFlags.Ephemeral });
    },
};
