const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const nHentai = require('shentai');
const { tenorApiKey } = require('../../../config.json');
const axios = require("axios").default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mystery-sauce')
        .setDescription('What kind of sauce will you get?'),
    async execute(interaction) {

        // Get data from https://www.npmjs.com/package/shentai#doujin
        const sHentai = new nHentai;
        const doujin = await sHentai.getRandom();

        // Get cute anime girl
        const thumbnailUrl = await axios.get(`https://g.tenor.com/v1/gifs?ids=24604597&key=${tenorApiKey}&media_filter=minimal&limit=1`)
        .then(ret => {return ret.data;})
        .catch(error => {console.error(error)})

        //Create embed
        const response = new MessageEmbed()
        .setColor(`RANDOM`)
        .setTitle(`MYSTERY SAUCE <:ok_hand:953832151101636629>`)
        .setImage(`${doujin.cover || `https://i.imgur.com/jI7G2nk.jpeg`}`)
        .setAuthor({ name: `${doujin.author || 'An unknown author'}`, iconURL: 'https://i.imgur.com/AfFp7pu.png' })
        .setThumbnail(`${thumbnailUrl["results"][0]["media"][0]["gif"]["url"]}`)
        .setURL(`https://nhentai.net/g/${doujin.id}`)
        .addFields(
            {name: 'Title', value: `${doujin["titles"]["original"]}`, inline: false},
            {name: 'English Title', value: `${doujin["titles"]["english"]}`, inline: false},
            {name: 'Tags', value: `${doujin.tags.toString()}`, inline: false},
        )

        await interaction.reply({ embeds: [response], ephemeral: true });
    },
};