const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand() && !interaction.isButton()) return;
    let command;
    let collector;
    if (interaction.isChatInputCommand())
      command = interaction.client.commands.get(interaction.commandName);

    if (!command && !interaction.isButton()) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      if (interaction.isChatInputCommand()) await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
    }
  },
};
