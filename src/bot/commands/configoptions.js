const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../../config/config.json');


/**
 * Retrieves the config keys for a given section from the config file.
 * @param {string} sectionName - The section to get keys for.
 * @returns {string[]} Array of key names.
 */
function getConfigKeys(sectionName) {
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (configData[sectionName] && typeof configData[sectionName] === 'object') {
    return Object.keys(configData[sectionName]);
  }
  return [];
}

/**
 * Retrieves the top-level configuration sections from the config file.
 * @returns {string[]} Array of section names.
 */
function getConfigSections() {
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return Object.keys(configData);
}

/**
 * Discord slash command for viewing available config keys for a section.
 * @type {import('discord.js').SlashCommandBuilder}
 */
module.exports = {
  data: new SlashCommandBuilder()
    .setName('configoptions')
    .setDescription('View available config keys for a section.')
    .addStringOption(opt =>
      opt.setName('section')
        .setDescription('Config section')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  /**
   * Autocomplete handler for the configoptions command.
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
   * Executes the configoptions command, replying with available config keys for a section.
   * @param {import('discord.js').ChatInputCommandInteraction} interaction - The command interaction.
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    if (!interaction.memberPermissions.has('Administrator')) {
      await interaction.reply({ content: 'You must be an administrator to use this command.' });
      return;
    }
    const sectionName = interaction.options.getString('section');
    const keyList = getConfigKeys(sectionName);
    if (!keyList.length) {
      await interaction.reply({ content: `No keys found for section '${sectionName}'.` });
    } else {
      await interaction.reply({ content: `Config keys for section '${sectionName}':\n${keyList.join(', ')}` });
    }
  }
};
