const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require("axios").default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('insult')
        .setDescription('Let the bot insult someone for you!')
        .addUserOption(option => 
            //name can ONLY have small characters and underscores (or lines)
            option.setName('user')
            .setDescription('The user you wish to insult')
            .setRequired(true)),
    async execute(interaction) {

        // Get data from api call
        const reply = await axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json')
        .then(ret => {return ret.data;})
        .catch(error => {console.error(error)})

        // Parse data into proper variables
        const insult = reply.insult;
        const user = interaction.options.getUser('user');
        const imgurl = user.displayAvatarURL({ dynamic: true });

        // Create embed
        const response = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`INSULT ALERT <:rotating_light:952546243635187793>`)
        .setDescription(`This one is dedicated to ${user}`)
        .setThumbnail(`${imgurl}`)
        .addField(`Dear ${user.username}`, `${insult}`, false)


        //Send embed
        await interaction.reply({ embeds: [response] });
    },
};