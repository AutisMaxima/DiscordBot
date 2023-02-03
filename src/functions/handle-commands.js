const fs = require('node:fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../../config.json');

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {

        /*
        Discord.js v13 Introduces slash commands.
        The commands array is filled with slash command builders that make the name and the description
        */

        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                //Gets the code encapsulated by module.exports
                const command = require(`../commands/${folder}/${file}`);
                // Set a new item in the Collection
                // With the key as the command name and the value as the exported module
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        //Creates a discordjs rest controller for the discord bot
        const rest = new REST({ version: '9' }).setToken(token);

        (async () => {
            try {
                console.log('Registering application commands...');
                //PUT request returns a promise which when executed, tries to return a message
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { 
                    body: client.commandArray },
                    );
                console.log('Successfully registered application commands!');
            } catch (error) {
                console.error(error);
            }
        })();
    };
};