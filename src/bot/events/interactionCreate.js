const botLogger = require('../modules/botLogger');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            botLogger.log(`Unknown command: ${interaction.commandName}`, 'WARN');
            return;
        }

        try {
            await command.execute(interaction);
            botLogger.log(`Command executed: ${interaction.commandName} by ${interaction.user.tag}`, 'COMMAND');
        } catch (error) {
            botLogger.logError(`Error executing command ${interaction.commandName}`, error);
            
            const errorMessage = { content: 'There was an error executing this command!', ephemeral: true };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    },
};
