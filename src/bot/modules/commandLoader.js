const fs = require('fs');
const path = require('path');
const { Collection, REST, Routes } = require('discord.js');
const botLogger = require('./botLogger');

/**
 * Loads all slash commands from the commands directory and registers them with Discord.
 *
 * @param {import('discord.js').Client} client - Discord client instance.
 * @returns {Promise<import('discord.js').Collection>} Collection of loaded commands.
 */
async function loadCommands(client) {
    client.commands = new Collection();
    
    const commandsPath = path.join(__dirname, '../commands');
    
    if (!fs.existsSync(commandsPath)) {
        botLogger.log('Commands directory not found, skipping command loading.', 'WARN');
        return client.commands;
    }

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    const commandsToRegister = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commandsToRegister.push(command.data.toJSON());
            botLogger.log(`Loaded command: ${command.data.name}`);
        } else {
            botLogger.log(`Warning: Command at ${file} is missing required "data" or "execute" property.`, 'WARN');
        }
    }

    // Register commands with Discord
    if (commandsToRegister.length > 0 && process.env.BOT_TOKEN && process.env.CLIENT_ID) {
        try {
            const rest = new REST().setToken(process.env.BOT_TOKEN);
            botLogger.log(`Registering ${commandsToRegister.length} slash command(s) with Discord...`);
            
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commandsToRegister },
            );
            
            botLogger.log(`Successfully registered ${commandsToRegister.length} slash command(s)!`);
        } catch (error) {
            botLogger.logError('Failed to register slash commands', error);
        }
    }

    return client.commands;
}

module.exports = { loadCommands };
