const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const nHentai = require('shentai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('popular-sauce')
        .setDescription('Gets a random popular sauce just for you!'),
    async execute(interaction) {

        //Get data from https://www.npmjs.com/package/shentai#doujin
        const sHentai = new nHentai;
        let search = await sHentai.getPopular();
        const randIndex = Math.floor(Math.random() * 5);
        const doujin = await sHentai.getDoujin(search[randIndex].id);

        //console.log(doujin.cover.replace(`/1.`, `/cover.`));
        const coverUrl = doujin.cover.replace(`/1.`, `/cover.`);

        //Create embed
        const response = new MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle(`POPULAR SAUCE <:ok_hand:953832151101636629>`)
        .setAuthor({ name: `${doujin.author || 'An unknown author'}`, iconURL: 'https://i.imgur.com/AfFp7pu.png' })
        .setThumbnail(`https://i.imgur.com/eRgvmKG.gif`)
        .setURL(`https://nhentai.net/g/${doujin.id}`)
        .setImage(`${coverUrl}`)
        .addFields(
            {name: 'Title', value: `${doujin["titles"]["original"]}`, inline: false},
            {name: 'English Title', value: `${doujin["titles"]["english"]}`, inline: false},
            {name: 'Tags', value: `${doujin.tags.toString()}`, inline: false},
        )

        await interaction.reply({ embeds: [response], ephemeral: true });
    },
};