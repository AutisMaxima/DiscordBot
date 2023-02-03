module.exports = (client) => {
    client.handleEvents = async (eventFiles, path) => {
        for (const file of eventFiles) {
            //Gets the code encapsulated by module.exports
            const event = require(`../events/${file}`);
            //event.once is an event that only happens once, unlike event.on
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
};