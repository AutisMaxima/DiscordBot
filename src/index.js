/* 
Require() is a built-in node.js function that includes modules that appears in other files
Unlike import, require can be run anywhere in the file
Requires the neccessary discord.js classes
*/
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('../config.json');
const dotenv = require('dotenv');
dotenv.config();

/*
This is a client instance created with the discord.js package
[Intents.FLAGS.GUILDS] means the bot can do mainly 'guild' stuff in a server.
For more information, see https://discord.com/developers/docs/topics/gateway#list-of-intents
*/
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

/*
Discord.js introduces a Collection, which is a Map with extra array-like functions
commandFiles uses the fileSystem to get .js files under the ./commands folder
*/
client.commands = new Collection();

const functions = fs.readdirSync('./src/functions').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./src/commands');
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

(async () => {
    console.log('Entering the handler...');
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, './src/events');
    client.handleCommands(commandFolders, './src/commands');

    /*
    This command is best done on the last line of the program
    Uses environment variable initialised in .env (accessible to me but not to others when I host it in public space)
    Logins to discord
    */
    client.login(token);
})();