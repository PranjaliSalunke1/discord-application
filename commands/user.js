const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user.")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The input to echo back")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option.setName("channel").setDescription("The channel to echo into")
    ),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    await interaction.reply(
      `This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`
    );
    const message = await interaction.fetchReply();
    await interaction.followUp({ content: "Hello again!", ephemeral: true });
  },
};
