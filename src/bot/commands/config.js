const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../../config/config.json');


/**
 * Retrieves the top-level configuration sections from the config file.
 * @returns {string[]} Array of section names.
 */
function getConfigSections() {
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return Object.keys(configData);
}

/**
 * Discord slash command for updating bot configuration and restarting the bot.
 * @type {import('discord.js').SlashCommandBuilder}
 */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Update bot configuration and restart the bot.')
    .addSubcommand(sub =>
      sub.setName('set')
        .setDescription('Set a config value')
        .addStringOption(opt =>
          opt.setName('section')
            .setDescription('Config section')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(opt =>
          opt.setName('key')
            .setDescription('Config key')
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName('value')
            .setDescription('New value for the key')
            .setRequired(true)
        )
    ),

  /**
   * Autocomplete handler for the config command.
   * @param {import('discord.js').AutocompleteInteraction} interaction - The autocomplete interaction.
   * @returns {Promise<void>}
   */
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    if (focusedOption.name === 'section') {
      const sectionList = getConfigSections();
      await interaction.respond(sectionList.map(sectionName => ({ name: sectionName, value: sectionName })));
    }
  },

  /**
   * Executes the config command, allowing admins to update config values.
   * @param {import('discord.js').ChatInputCommandInteraction} interaction - The command interaction.
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    if (!interaction.memberPermissions.has('Administrator')) {
      await interaction.reply({ content: 'You must be an administrator to use this command.' });
      return;
    }
    if (interaction.options.getSubcommand() === 'set') {
      const sectionName = interaction.options.getString('section');
      const keyName = interaction.options.getString('key');
      let newValue = interaction.options.getString('value');
      let configData;
      try {
        configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (err) {
        await interaction.reply({ content: 'Failed to read config file.' });
        return;
      }
      if (!configData.hasOwnProperty(sectionName)) {
        await interaction.reply({ content: `Section '${sectionName}' not found in config.` });
        return;
      }
      if (!configData[sectionName].hasOwnProperty(keyName)) {
        await interaction.reply({ content: `Key '${keyName}' not found in section '${sectionName}'.` });
        return;
      }
      // Try to parse value as JSON for booleans/numbers/objects
      try {
        newValue = JSON.parse(newValue);
      } catch (e) {
        // Leave as string if not JSON
      }
      configData[sectionName][keyName] = newValue;
      try {
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
      } catch (err) {
        await interaction.reply({ content: 'Failed to write config file.' });
        return;
      }
      // Update bot presence/activity if changed
      if (sectionName === 'discordConfig' && keyName === 'botActivity') {
        await interaction.client.user.setPresence({
          activities: [{ name: newValue, type: 0 }],
          status: 'online',
        });
      }
      // Optionally update other in-memory config here
      await interaction.reply({ content: `Config updated: ${sectionName}.${keyName} is now set to '${newValue}'.` });
    }
  }
};
