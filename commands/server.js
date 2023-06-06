const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server."),
  async execute(interaction) {
    // interaction.guild is the object representing the Guild in which the command was run
    await interaction.deferReply({
      content: "Visible only to you",
      ephemeral: true,
    });
    await wait(4000);
    await interaction.editReply(
      `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`
    );
    // await interaction.reply({
    //   content: `This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`,
    //   ephemeral: true,
    // });
  },
};
