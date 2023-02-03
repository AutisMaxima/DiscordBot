const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('Returns basic information about you')
        .addUserOption(option => 
            //name can ONLY have small characters and underscores (or lines)
            option.setName('user')
            .setDescription('The user you wish to get information on')
            .setRequired(true)),

    async execute(interaction) {   

        /*
        Get relevant data about the user
        */
        const user = interaction.options.getUser('user');
        const username = user.username;
        const tag = user.discriminator;
        const id = user.id;
        const createdAt = user.createdAt.toLocaleDateString('en-UK');
        const imgurl = user.displayAvatarURL({ size: 512, dynamic: true });

        /*
        Sets up the embed object and puts in Response
        */
        const response = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`${username}'s Info <:book:952378758625632276>`)
        .setDescription('All about the user!')
        .setImage(`${imgurl}`)
        .addFields(
            { name: 'User ID', value: `${id}`, inline: true },
            { name: 'User Tag', value: `${tag}`, inline: true },
            { name: 'User Since', value: `${createdAt}`, inline: false })
        .setTimestamp();

        //console.log(`${imgurl}`);
        await interaction.reply({ embeds: [response], ephemeral: true });
    },
};