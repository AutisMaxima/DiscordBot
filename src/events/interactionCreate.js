module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {

		if (!interaction.isCommand()) return;

		//Tries to get the command module from the collectiom
		const command = client.commands.get(interaction.commandName);
	
		//Safety
		if (!command) return;
	
		try {
			console.log(`###################################################`);
			const startDate = new Date();
			await command.execute(interaction); //command.execute(interaction) returns a promise
			const endDate = new Date();
			console.log(`Interaction runtime: ${endDate.getTime() - startDate.getTime()}ms`);
			console.log(`###################################################`);
		} catch (error) {
			console.error(error);
			console.log(`###################################################`);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
	},
};