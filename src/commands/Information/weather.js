const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Collection } = require('discord.js');
const { abstractApiKey, weatherApiKey, tenorApiKey } = require('../../../config.json');
const axios = require("axios").default;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Get the weather in your current location!')
    .addSubcommand(subcommand =>
		subcommand
			.setName('jakarta')
			.setDescription('Info about the weather in Jakarta, Indonesia'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('singapore')
            .setDescription('Info about the weather in Singapore'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('tokyo')
            .setDescription('Info about the weather in Tokyo, Japan'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('london')
            .setDescription('Info about the weather in London, United Kingdom'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('antartica')
            .setDescription('Info about the weather in Antartica'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('host')
            .setDescription('Info about the weather in Host')),
    async execute(interaction) {

        console.log("------------------WEATHER API----------------------");
        //Defer reply for requests that take longer than 3 seconds

        const option = interaction.options.getSubcommand();

        //Defer deferreply
        await interaction.deferReply();
        let startDate, endDate, lat = 0, long = 0, 
        city = 'undefined', country = 'undefined';

        if(option === 'host') {
            //Get user location from API call
            startDate = new Date();
            const userLocation = await axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${abstractApiKey}`)
            .then(ret => {return ret.data;})
            .catch(error => {console.error(error)})
            endDate = new Date();

            console.log(`userLocation fetch time: ${endDate.getTime() - startDate.getTime()}ms`);

            lat = userLocation.latitude;
            long = userLocation.longitude;
            city = userLocation.city;
            country = userLocation.country;

        } else if(option === 'jakarta') {
            lat = 6.2088; long = 106.8456; city = `Jakarta`; country = `Indonesia`;
        } else if(option === 'singapore') {
            lat = 1.3521; long = 103.8198; city = `Singapore`; country = `Singapore`;
        } else if(option === 'tokyo') {
            lat = 35.6762; long = 139.6503; city = `Tokyo`; country = `Japan`;
        } else if(option === 'london') {
            lat = 51.5072; long = 0.1276; city = `London`; country = `United Kingdom`;
        } else if(option === 'antartica') {
            lat = 82.8628; long = 135.0000; city = `Antartica`; country = `Mulitple`;
        }

        // Get weather data from API call
        startDate = new Date();
        const weatherData = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${weatherApiKey}&units=metric`)  
        .then(ret => {return ret.data;})
        .catch(error => {console.error(error)})
        endDate = new Date();

        console.log(`weatherData fetch time: ${endDate.getTime() - startDate.getTime()}ms`);

        //Reverse geocoding (might require google reverse coding API)
        // if(option != 'host') {
        //     // Get weather data from API call
        //     startDate = new Date();
        //     const location = await axios.get(
        //         `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${long}&limit=1&appid=${weatherApiKey}`)  
        //     .then(ret => {return ret.data;})
        //     .catch(error => {console.error(error)})
        //     endDate = new Date();

        //     console.log(`location fetch time: ${endDate.getTime() - startDate.getTime()}ms`);
        //     console.log(`${location}`);
        //     city = location.city;
        //     country = location.country;
        // }

        //Tenor API call
        const weatherGifs = new Collection();
        weatherGifs.set('Drizzle', 11257212);
        weatherGifs.set('Clear', 19560345);
        weatherGifs.set('Rain', 19023974);
        weatherGifs.set('Thunderstorm', 16825315);
        weatherGifs.set('Snow', 22075498);
        weatherGifs.set('Clouds', 14833164);

        const weatherID = weatherGifs.get(`${weatherData["weather"][0]["main"]}`) || 20186795;

        startDate = new Date();
        const weatherGif = await axios.get(`https://g.tenor.com/v1/gifs?ids=${weatherID}&key=${tenorApiKey}&media_filter=minimal&limit=1`)
        .then(ret => {return ret.data;})
        .catch(error => {console.error(error)})
        endDate = new Date();

        console.log(`weatherGif fetch time: ${endDate.getTime() - startDate.getTime()}ms`);

        //Create embed
        const response = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Weather Information')
        // .setThumbnail(`${userLocation["flag"]["png"]}`)
        .setDescription(`${weatherData["weather"][0]["description"]}`)
        .setThumbnail(`http://openweathermap.org/img/wn/${weatherData["weather"][0]["icon"]}@2x.png`)
        .addFields(
            // { name: '\u200B', value: '\u200B' },
            {name: 'City:', value: `${city}`, inline: true},
            {name: 'Country:', value: `${country}`, inline: true},
            {name: 'Temprature:', value: `${weatherData["main"]["temp"]}\u00B0C`, inline: true},
            {name: 'Feels like:', value: `${weatherData["main"]["feels_like"]}\u00B0C`, inline: true},
            {name: 'Pressure:', value: `${weatherData["main"]["pressure"]} hPa`, inline: true},
            {name: 'Humidity:', value: `${weatherData["main"]["humidity"]}%`, inline: true},
            {name: 'Visibility:', value: `${weatherData.visibility/1000} km`, inline: true},
            {name: 'Wind Speed:', value: `${weatherData["wind"]["speed"]} m/s`, inline: true},
            {name: 'Wind Direction:', value: `${weatherData["wind"]["speed"]}\u00B0`, inline: true},
        )
        .addFields(
        )
        .setImage(`${weatherGif["results"][0]["media"][0]["gif"]["url"] || weatherData["weather"][0]["description"]}`);
        console.log("---------------------------------------------------");

        await interaction.editReply({ embeds: [response], ephemeral: true });
    }
}