const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '../../config/config.json');

function getConfigKeys(sectionName) {
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (configData[sectionName] && typeof configData[sectionName] === 'object') {
    return Object.keys(configData[sectionName]);
  }
  return [];
}
function getConfigSections() {
  const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return Object.keys(configData);
}

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
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    if (focusedOption.name === 'section') {
      const sectionList = getConfigSections();
      await interaction.respond(sectionList.map(sectionName => ({ name: sectionName, value: sectionName })));
    }
  },
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
