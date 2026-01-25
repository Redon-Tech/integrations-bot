const botLogger = require("../modules/botLogger");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (command && typeof command.autocomplete === "function") {
        try {
          await command.autocomplete(interaction);
        } catch (error) {
          botLogger.logError(`Autocomplete for /${interaction.commandName} failed`, error);
        }
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      botLogger.log(`Unknown command: ${interaction.commandName}`, "WARN");
      return;
    }

    try {
      await command.execute(interaction);
      botLogger.log(
        `Command executed: ${interaction.commandName} by ${interaction.user.tag}`,
        "COMMAND",
      );
    } catch (error) {
      botLogger.logError(`Command /${command.data.name} failed`, {
        error: error,
        user: interaction.user.tag,
        guild: interaction.guild?.name,
        options: interaction.options.data,
        stack: error.stack,
      });

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp("There was an error while executing this command.");
      } else {
        await interaction.reply("There was an error while executing this command.");
      }
    }
  },
};
