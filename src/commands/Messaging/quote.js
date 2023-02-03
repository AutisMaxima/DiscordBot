const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require("axios").default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Get a random quote!'),
    async execute(interaction) {

        // Get data from api call
        const reply = await axios.get('https://zenquotes.io/api/random')
        .then(ret => {return ret.data;})
        .catch(error => {console.error(error)})

        // Parse data into proper variables
        const quote = reply[0]["q"];
        const author = reply[0]["a"];

        // Send reply
        await interaction.reply(`${quote} - ${author}`);
    },
};