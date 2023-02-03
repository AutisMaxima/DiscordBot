const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Returns basic information about the server'),
    async execute(interaction) {

        // Parse relevant data into variables for easier access
        const guild = await interaction.guild;
        const guildname = guild.name;
        const id = guild.id;
        const memberCount = guild.memberCount;
        const desc = guild.description;
        const iconURL = await guild.iconURL({ size: 1024, dynamic: true });
        const joinDate = guild.joinedAt.toLocaleDateString('en-UK');

        // Create appropriate embedded message
        const response = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`About ${guildname}`)
        .setDescription('All about the server!')
        .setImage(`${iconURL}`)
        .setFields(
            { name: 'Server ID', value: `${id}`, inline: true },
            { name: 'Number of Members', value: `${memberCount}`, inline: true },
            { name: 'Join Date', value: `${joinDate}`, inline: false },
            { name: 'Description', value: `${desc}`, inline: false })
        .setTimestamp();

        // Send reply
        await interaction.reply({ embeds: [response], ephemeral: true });
    },
};